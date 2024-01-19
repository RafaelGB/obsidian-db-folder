import { RelationInfo } from "cdm/DatabaseModel";
import { TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { obtainColumnsFromFolder, obtainColumnsFromRows } from "components/Columns";
import { DatabaseCore, DEFAULT_SETTINGS } from "helpers/Constants";
import { resolve_tfile } from "helpers/FileManagement";
import { adapterTFilesToRows } from "helpers/VaultManagement";
import { SMarkdownPage } from "obsidian-dataview";
import { dataApiBuilder } from "views/DataApiBuilder";
import DatabaseInfo from "./DatabaseInfo";
import { DataviewService } from "./DataviewService";
import { LOGGER } from "./Logger";


class RelationalServiceInstance {

    private static instance: RelationalServiceInstance;

    /**
     * Search for all databases in the vault returning a Record of all databases
     * @param currentPath 
     * @returns 
     */
    public recordAllDatabases(): Record<string, string> {
        const avaliableDDBB: Record<string, string> = {};
        DataviewService.getDataviewAPI().pages().where((page: any) => {
            return page[DatabaseCore.FRONTMATTER_KEY] !== undefined;
        }).forEach((page: any) => {
            const file = (page as SMarkdownPage).file;
            avaliableDDBB[file.path] = file.name;
        });
        return avaliableDDBB;
    }

    /**
     * Obtain all the information from a relation
     * @param ddbbPath 
     * @returns 
     */
    public async obtainInfoFromRelation(ddbbPath: string): Promise<RelationInfo> {
        const recordRows: Record<string, string> = {};
        const ddbbFile = resolve_tfile(ddbbPath);
        const ddbbInfo = await new DatabaseInfo(ddbbFile, DEFAULT_SETTINGS.local_settings).build();
        const relatedColumns = await obtainColumnsFromFolder(ddbbInfo.yaml.columns);
        const relatedRows = await adapterTFilesToRows(ddbbFile, relatedColumns, ddbbInfo.yaml.config, ddbbInfo.yaml.filters);
        relatedRows.forEach((row) => {
            const file = row.__note__.getFile()
            recordRows[file.path] = file.basename;
        });
        return { recordRows, ddbbFile, ddbbInfo, relatedColumns, relatedRows }
    }

    /**
     * Obtain all the fields from a relation
     * @param ddbbPath 
     * @param ddbbConfig 
     * @param columns 
     * @returns 
     */
    public async recordFieldsFromRelation(ddbbPath: string, ddbbConfig: LocalSettings, columns?: TableColumn[]): Promise<Record<string, string>> {
        const relationFields: Record<string, string> = {};
        const ddbbFile = resolve_tfile(ddbbPath);
        const ddbbInfo = await new DatabaseInfo(ddbbFile, ddbbConfig).build();
        const fields = await obtainColumnsFromRows(
            ddbbFile.parent.path,
            ddbbInfo.yaml.config,
            ddbbInfo.yaml.filters,
            columns);
        // get unique fields from all rows
        fields.forEach((field) => {
            // iterate over all fields in the row
            relationFields[field] = field;
        });
        return relationFields;
    }

    /**
     * Create a new note into a relation
     * @param ddbbPath 
     * @param content 
     */
    public async createNoteIntoRelation(ddbbPath: string, newFilename: string): Promise<void> {
        LOGGER.info(`--> createNoteIntoRelation. Creating note ${newFilename} into relation ${ddbbPath}`);
        const ddbbFile = resolve_tfile(ddbbPath);
        const ddbbInfo = await new DatabaseInfo(ddbbFile, DEFAULT_SETTINGS.local_settings).build();
        const dataApi = dataApiBuilder(ddbbFile, ddbbInfo.yaml.config.implementation);
        const relatedColumns = await obtainColumnsFromFolder(ddbbInfo.yaml.columns);
        await dataApi.create(newFilename, relatedColumns, ddbbInfo.yaml.config);
        LOGGER.info(`<-- createNoteIntoRelation. Note ${newFilename} created into relation ${ddbbPath}`);
    }

    /**
     * Singleton instance
     * @returns {VaultManager}
     */
    public static getInstance(): RelationalServiceInstance {
        if (!this.instance) {
            this.instance = new RelationalServiceInstance();
        }
        return this.instance;
    }
}

export const RelationalService = RelationalServiceInstance.getInstance();