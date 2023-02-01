import { DB_ICONS, DEFAULT_COLUMN_CONFIG, InputType, SourceDataTypes } from "helpers/Constants";
import DBFolderPlugin from "main";

import {
    DatabaseView,
} from 'views/DatabaseView';
import { LOGGER } from "services/Logger";
import { DataFieldType, DataQueryResult, ProjectView, ProjectViewProps } from "obsidian-projects-types";
import { resolve_tfile, resolve_tfolder } from "helpers/FileManagement";
import { generateDbConfiguration, generateNewDatabase } from "helpers/CommandsHelper";
import { LocalSettings } from "cdm/SettingsModel";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { c, dbTrim } from "helpers/StylesHelper";
import { CustomView } from "views/AbstractView";

const projectsMetadataColumns = ["File", "name", "path"];
class ProjectAPI extends ProjectView {
    private ignoreDataAutoReload: boolean = false;
    private plugin: DBFolderPlugin;
    private view: CustomView;

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
        if (this.ignoreDataAutoReload || !this.view) {
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
                const { name, type, repeated } = field;
                /**
                 * I can not use the view object here without make it a class variable
                 * and I don't want to do that because I can not support multiple views
                 * 
                 * Could we add the config to the data object? I can manage a map of views with that
                 */
                const inputType = this.projectsTypeToPluginTypeMapper(type, repeated);
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
        this.ignoreDataAutoReload = true;
        const { contentEl, config, saveConfig, project, viewId } = projectView;

        const path = project.dataSource.kind === "folder" ? project.dataSource.config.path : ""

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
        await this.view
            .initRootContainer(file)
            .build();
        this.dataEl = contentEl
            .createDiv(c("project-view-container"))
            .appendChild(this.view.containerEl);
        this.view.onload();
        this.ignoreDataAutoReload = false;
        await this.view.reloadDatabase();
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

        if (project.dataSource.kind === "dataview") {
            localSettings.source_destination_path = "";
            localSettings.source_data = SourceDataTypes.QUERY;
            /* 
            * Check if the query contains FROM or from
            * then Split query to only get subtring from "from" to the end
            */
            const dataviewQuery = project.dataSource.config.query
            let query = "";
            const SOURCE_FLAG = "FROM";
            if (dataviewQuery.contains(SOURCE_FLAG)) {
                query = dataviewQuery.split(SOURCE_FLAG)[1];
            } else if (dataviewQuery.contains(SOURCE_FLAG.toLowerCase())) {
                query = dataviewQuery.split(SOURCE_FLAG.toLowerCase())[1];
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
    private projectsTypeToPluginTypeMapper(type: string, repeated: boolean): string {
        if (repeated) {
            return InputType.TAGS
        }

        let inputType = "";
        const mapper = new Map<string, string>(
            [
                [DataFieldType.Number, InputType.NUMBER],
                [DataFieldType.Boolean, InputType.CHECKBOX],
                [DataFieldType.Date, InputType.CALENDAR],
            ]
        );
        if (mapper.has(type)) {
            inputType = mapper.get(type);
        } else {
            inputType = InputType.TEXT;
        }

        return inputType;
    }
}

export default ProjectAPI;