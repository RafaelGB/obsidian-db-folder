import { DB_ICONS, DEFAULT_COLUMN_CONFIG, InputType, SourceDataTypes } from "helpers/Constants";
import DBFolderPlugin from "main";

import {
    DatabaseView,
} from 'DatabaseView';
import { LOGGER } from "services/Logger";
import { DataFieldType, DataQueryResult, ProjectView, ProjectViewProps } from "obsidian-projects-types";
import { resolve_tfile, resolve_tfolder } from "helpers/FileManagement";
import { generateDbConfiguration, generateNewDatabase } from "helpers/CommandsHelper";
import { LocalSettings } from "cdm/SettingsModel";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { c, dbTrim } from "helpers/StylesHelper";

const projectsMetadataColumns = ["File", "name", "path"];
class ProjectAPI extends ProjectView {
    private plugin: DBFolderPlugin;
    private view: DatabaseView;
    private enableAutoReload: boolean;

    constructor(plugin: DBFolderPlugin) {
        super();
        this.plugin = plugin;
    }
    dataEl?: HTMLElement;

    getViewType(): string {
        return "dbfolder-view";
    }

    getDisplayName(): string {
        return "Database Folder";
    }

    getIcon(): string {
        return DB_ICONS.NAME;
    }

    async onData({ data }: DataQueryResult) {
        // Check if the there is a data view
        if (!this.view || !this.enableAutoReload) {
            return;
        }

        const { fields } = data;
        const currentColumnsLength = Object
            .values(this.view.diskConfig.yaml.columns)
            .filter((column) => !column.isMetadata).length;
        const actualFields = fields
            .filter((field) => !projectsMetadataColumns.contains(field.name));

        if (currentColumnsLength < actualFields.length) {
            const newColumns: Record<string, DatabaseColumn> = {};
            actualFields.forEach((field, index) => {
                const { name, type } = field;
                /**
                 * I can not use the view object here without make it a class variable
                 * and I don't want to do that because I can not support multiple views
                 * 
                 * Could we add the config to the data object? I can manage a map of views with that
                 */
                const inputType = this.projectsTypeToPluginTypeMapper(type);
                const key = dbTrim(name);
                const newColumn: DatabaseColumn = {
                    input: inputType,
                    accessorKey: key,
                    key: key,
                    id: key,
                    label: name,
                    position: index,
                    config: {
                        ...DEFAULT_COLUMN_CONFIG,
                        isInline: false
                    },
                };
                newColumns[name] = newColumn;

            });

            this.view.diskConfig.yaml.columns = newColumns;
            await this.view.diskConfig.saveOnDisk();
            await this.view.reloadDatabase();
        }
    }

    // onOpens is called whenever the user activates your view.
    //
    // `contentEl`    HTML element where you can attach your view.
    // `config`       JSON object with optional view configuration.
    // `saveConfig`   Callback to save configuration changes.
    async onOpen(projectView: ProjectViewProps) {
        const { contentEl, config, saveConfig, project, viewId } = projectView;
        const { path } = project;
        const filePath = config.filepath;
        if (!filePath) {
            const folder = resolve_tfolder(path);
            const customLocalSettings = this.generateLocalSettings(projectView);
            // If the config is empty, we need to create a Default
            const dbConfig = generateDbConfiguration(customLocalSettings);
            await generateNewDatabase(dbConfig, folder, `${viewId}_db`, false);
            saveConfig({ filepath: `${path}/${viewId}_db.md` });
        }
        const leaf = app.workspace.getLeaf();
        const file = resolve_tfile(filePath);
        this.view = new DatabaseView(leaf, this.plugin, file);
        this.view.initRootContainer(file);
        await this.view.initDatabase();
        this.dataEl = contentEl
            .createDiv(c("project-view-container"))
            .appendChild(this.view.containerEl);
        this.view.onload();
        this.enableAutoReload = true;
        LOGGER.debug("Database initialized successfully from project view");
    }

    async onClose() {
        this.view.destroy();
        this.view = null;
        LOGGER.debug("Closing project view ", this.getDisplayName());
    }

    /**
     * Generate the local settings for the database
     * @param projectView 
     * @returns 
     */
    private generateLocalSettings(projectView: ProjectViewProps): LocalSettings {
        const { project } = projectView;
        const localSettings: LocalSettings = {
            ...this.plugin.settings.local_settings,
        }
        if (project.dataview) {
            localSettings.source_destination_path = project.path;
            localSettings.source_data = SourceDataTypes.QUERY;
            /* 
            * Check if the query contains FROM or from
            * then Split query to only get subtring from "from" to the end
            */
            let query = "";
            const SOURCE_FLAG = "FROM";
            if (project.query?.contains(SOURCE_FLAG)) {
                query = project.query?.split(SOURCE_FLAG)[1];
            } else if (project.query?.contains(SOURCE_FLAG.toLowerCase())) {
                query = project.query?.split(SOURCE_FLAG.toLowerCase())[1];
            } else {
                // Handle error with default configuation
                localSettings.source_data = SourceDataTypes.CURRENT_FOLDER;
                LOGGER.error(`The query does not contain a ${SOURCE_FLAG} clause. Using current folder as source data`);
            }
            localSettings.source_form_result = `${SOURCE_FLAG} ${query}`;
        }

        return localSettings;
    }

    /**
     * Maps the data type from the projects to the plugin data type
     * @param type
     * @returns 
     */
    private projectsTypeToPluginTypeMapper(type: string): string {
        let inputType = "";
        switch (type) {
            case DataFieldType.Number:
                inputType = InputType.NUMBER;
                break;
            case DataFieldType.Boolean:
                inputType = InputType.CHECKBOX;
                break;
            case DataFieldType.Date:
                inputType = InputType.CALENDAR;
                break;
            case DataFieldType.List:
                inputType = InputType.TAGS;
                break;
            // Default to text
            case DataFieldType.String:
            case DataFieldType.Link:
            case DataFieldType.Unknown:
            default:
                inputType = InputType.TEXT;
        }
        return inputType;
    }
}

export default ProjectAPI;