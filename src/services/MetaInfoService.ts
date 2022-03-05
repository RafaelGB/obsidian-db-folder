import type {
    App, 
    TFile
} from 'obsidian';

import {parseYaml} from 'obsidian';
import {MetaType} from 'cdm/MetaType';
import { RowType} from 'cdm/FolderModel';

export type Property = {key: string, content: RowType, type: MetaType};

export class MetaInfoService {
    private static instance: MetaInfoService;
    private app: App;

    constructor(app: App) {
        this.app = app;
    }

    public async getTagsForFile(file: TFile): Promise<Property[]> {
        const cache = this.app.metadataCache.getFileCache(file);
        if (!cache) return [];
        const tags = cache.tags;
        if (!tags) return [];

        const mTags: Property[] = [];
        tags.forEach(tag => mTags.push({key: tag.tag, content: tag.tag, type: MetaType.Tag}));
        return mTags;
    }

    public async parseFrontmatter(file: TFile): Promise<Property[]> {
        const frontmatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
        if (!frontmatter) return [];
        const {position: {start, end}} = frontmatter;
        const filecontent = await this.app.vault.cachedRead(file);

        const yamlContent: string = filecontent.split("\n").slice(start.line, end.line).join("\n");
        const parsedYaml = parseYaml(yamlContent);

        const metaYaml: Property[] = [];

        for (const key in parsedYaml) {
            metaYaml.push({key, content: parsedYaml[key], type: MetaType.YAML});
        }

        return metaYaml;
    }

    public async parseInlineFields(file: TFile): Promise<Property[]> {
        const content = await this.app.vault.cachedRead(file);

        return content.split("\n").reduce((obj: Property[], str: string) => {
            const parts = str.split("::");

            if (parts[0] && parts[1]) {
                obj.push({key: parts[0].replaceAll("**",""), content: parts[1].trim(), type: MetaType.Dataview});
            }
            else if (str.includes("::")) {
                const key: string = str.replace("::",'').replaceAll("**","");
                obj.push({key, content: "", type: MetaType.Dataview});
            }

            return obj;
        },  []);
    }

    public async getPropertiesInFile(file: TFile): Promise<Property[]> {
        const yaml = await this.parseFrontmatter(file);
        const inlineFields = await this.parseInlineFields(file);

        return [...yaml, ...inlineFields];
    }

    /**
     * Singleton instance
     * @returns {Schema}
     */
    public static getInstance(app?: App): MetaInfoService {
    if (!MetaInfoService.instance) {
        MetaInfoService.instance = new MetaInfoService(app);
    }
        return MetaInfoService.instance;
    }
}