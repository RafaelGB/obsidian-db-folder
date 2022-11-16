import { DB_ICONS, SourceDataTypes } from "helpers/Constants";
import DBFolderPlugin from "main";

import {
    DatabaseView,
} from 'DatabaseView';
import { LOGGER } from "services/Logger";
import { DataQueryResult, ProjectView, ProjectViewProps } from "obsidian-projects-types";
import { resolve_tfile, resolve_tfolder } from "helpers/FileManagement";
import { generateDbConfiguration, generateNewDatabase } from "helpers/CommandsHelper";
import { LocalSettings } from "cdm/SettingsModel";

class ProjectAPI extends ProjectView {
    private plugin: DBFolderPlugin;

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
        const { fields } = data;
        fields.forEach((field) => {
            const { name, type, identifier, derived } = field;
            /**
             * I can not use the view object here without make it a class variable
             * and I don't want to do that because I can not support multiple views
             * 
             * Could we add the config to the data object? I can manage a map of views with that
             */
        });
    }

    // onOpens is called whenever the user activates your view.
    //
    // `contentEl`    HTML element where you can attach your view.
    // `config`       JSON object with optional view configuration.
    // `saveConfig`   Callback to save configuration changes.
    async onOpen(projectView: ProjectViewProps) {
        const { contentEl, config, saveConfig, project, viewId } = projectView;
        const { path } = project;
        let filePath = config.filepath;
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
        const view = new DatabaseView(leaf, this.plugin, file);
        view.initRootContainer(file);
        await view.initDatabase();
        LOGGER.debug("Database initialized successfully from project view");
        this.dataEl = contentEl.createDiv().appendChild(view.containerEl);
    }

    async onClose() {
        LOGGER.debug("Closing project view ", this.getDisplayName());
    }

    private generateLocalSettings(projectView: ProjectViewProps): LocalSettings {
        const { project } = projectView;
        const localSettings: LocalSettings = {
            ...this.plugin.settings.local_settings,
        }
        if (project.dataview) {
            localSettings.source_data = SourceDataTypes.QUERY;
            /* 
            * Check if the query contains FROM or from
            * then Split query to only get subtring from "from" to the end
            */
            let query = "";
            if (project.query?.contains("FROM")) {
                query = project.query?.split("FROM")[1];
            } else if (project.query?.contains("from")) {
                query = project.query?.split("from")[1];
            } else {
                // Handle error with default configuation
                localSettings.source_data = SourceDataTypes.CURRENT_FOLDER;
                LOGGER.error("The query does not contain a FROM clause. Using current folder as source data");
            }
            localSettings.source_destination_path = query
        }

        return localSettings;
    }
}

export default ProjectAPI;