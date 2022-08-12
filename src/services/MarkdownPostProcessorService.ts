import { DatabaseCore } from "helpers/Constants";
import DBFolderPlugin from "main";
import { MarkdownPostProcessorContext } from "obsidian";
import DatabaseInfo from "services/DatabaseInfo";
import { DataviewService } from "services/DataviewService";
import { obtainColumnsFromFolder, obtainMetadataColumns } from "components/Columns";
import { adapterTFilesToRows } from "helpers/VaultManagement";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { resolve_tfile } from "helpers/FileManagement";
/**
 * Keep info about a note and offer methods to manipulate it
 */
export class PreviewDatabaseModeService {
    private static instance: PreviewDatabaseModeService;
    private plugin: DBFolderPlugin;
    constructor(plugin: DBFolderPlugin) {
        this.plugin = plugin;
        if (!PreviewDatabaseModeService.instance) {
            PreviewDatabaseModeService.instance = this;
        }
    }
    hoverEvent = (e: any) => {
        if (!e.linktext) {
            this.plugin.hover.linkText = null;
            return;
        }
        this.plugin.hover.linkText = e.linktext;
        this.plugin.hover.sourcePath = e.sourcePath;
    };
    /**
 *
 * @param el
 * @param ctx
 */
    markdownPostProcessor = async (
        el: HTMLElement,
        ctx: MarkdownPostProcessorContext,
    ) => {
        //check to see if we are rendering in editing mode of live preview
        //if yes, then there should be no .internal-embed containers
        const embeddedItems = el.querySelectorAll(".internal-embed");
        if (embeddedItems.length === 0) {
            this.tmpObsidianWYSIWYG(el, ctx);
            return;
        }

        //If the file being processed is an database file,
        //then I want to hide all embedded items as these will be
        //transcluded text element or some other transcluded content inside the Database file
        //in reading mode these elements should be hidden
        if (ctx.frontmatter !== undefined && Object.prototype.hasOwnProperty.call(ctx.frontmatter, DatabaseCore.FRONTMATTER_KEY)) {
            el.style.display = "none";
            return;
        }
    };

    tmpObsidianWYSIWYG = async (
        el: HTMLElement,
        ctx: MarkdownPostProcessorContext,
    ) => {
        if (!ctx.frontmatter) {
            return;
        }
        if (!Object.prototype.hasOwnProperty.call(ctx.frontmatter, DatabaseCore.FRONTMATTER_KEY)) {
            return;
        }
        //@ts-ignore
        if (ctx.remainingNestLevel < 4) {
            return;
        }
        if (!el.querySelector(".frontmatter")) {
            el.style.display = "none";
            return;
        }
        el.empty();
        const previewContainer = await this.renderPreview(el, ctx);
        setTimeout(async () => {
            let internalEmbedDiv: HTMLElement = el;
            while (
                !internalEmbedDiv.hasClass("internal-embed") &&
                internalEmbedDiv.parentElement
            ) {
                internalEmbedDiv = internalEmbedDiv.parentElement;
            }

            if (!internalEmbedDiv.hasClass("internal-embed")) {
                el.empty();
                el.appendChild(previewContainer);
                return;
            }

            internalEmbedDiv.empty();
            const previewTimeoutContainer = await this.renderPreview(internalEmbedDiv, ctx);
            //timer to avoid the image flickering when the user is typing
            let timer: NodeJS.Timeout = null;
            const observer = new MutationObserver((m) => {
                if (!["alt", "width", "height"].contains(m[0]?.attributeName)) {
                    return;
                }
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    timer = null;
                    previewTimeoutContainer.empty();
                }, 500);
            });
            observer.observe(previewTimeoutContainer, {
                attributes: true, //configure it to listen to attribute changes
            });
        }, 300);
    };

    private renderPreview = async (
        el: HTMLElement,
        ctx: MarkdownPostProcessorContext,
    ): Promise<HTMLElement> => {
        const dbFile = resolve_tfile(ctx.sourcePath);
        const databaseDisk = new DatabaseInfo(dbFile);
        await databaseDisk.initDatabaseconfigYaml(
            this.plugin.settings.local_settings
        );

        const div = createDiv();
        div.textContent = `${databaseDisk
            .yaml.description}`;
        el.appendChild(div);
        let yamlColumns: Record<string, DatabaseColumn> =
            databaseDisk.yaml.columns;
        // Complete the columns with the metadata columns
        yamlColumns = await obtainMetadataColumns(
            yamlColumns,
            databaseDisk.yaml.config
        );
        // Obtain base information about columns
        const columns = await obtainColumnsFromFolder(yamlColumns);
        const rows = await adapterTFilesToRows(
            dbFile.parent.path,
            columns,
            databaseDisk.yaml.config,
            databaseDisk.yaml.filters
        );
        const dataviewCols: string[] = columns
            .filter((col) => !col.skipPersist)
            .map((c) => c.key);
        const dataviewMatrixRow: any[][] = rows.map((r) =>
            dataviewCols.map((c) => r[c])
        );
        DataviewService.getDataviewAPI().table(
            dataviewCols,
            dataviewMatrixRow,
            div,
            this.plugin,
            ctx.sourcePath
        )
        return div;
    }

    public static getInstance(plugin?: DBFolderPlugin): PreviewDatabaseModeService {
        if (!this.instance) {
            this.instance = new PreviewDatabaseModeService(plugin);
        }
        return this.instance;
    }
}