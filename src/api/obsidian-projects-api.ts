import { DB_ICONS } from "helpers/Constants";
import DBFolderPlugin from "main";

import {
    DatabaseView,
} from 'DatabaseView';
import { LOGGER } from "services/Logger";
import { DataQueryResult, ProjectView, ProjectViewProps } from "obsidian-projects-types";
import { resolve_tfile, resolve_tfolder } from "helpers/FileManagement";
import { generateDbConfiguration, generateNewDatabase } from "helpers/CommandsHelper";

class ProjectAPI extends ProjectView {
    private plugin: DBFolderPlugin;
    private view: DatabaseView;

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
        // Do nothing here
        // Data is handled by the database itself and will be updated automatically every time the view is opened


    }

    // onOpens is called whenever the user activates your view.
    //
    // `contentEl`    HTML element where you can attach your view.
    // `config`       JSON object with optional view configuration.
    // `saveConfig`   Callback to save configuration changes.
    async onOpen({ contentEl, config, saveConfig, project, viewId }: ProjectViewProps) {
        const { path } = project;
        let filePath = config.filepath;
        if (!filePath) {
            const folder = resolve_tfolder(path);
            // If the config is empty, we need to create a Default
            const dbConfig = generateDbConfiguration(this.plugin.settings.local_settings);
            await generateNewDatabase(dbConfig, folder, `${viewId}_db`, false);
            saveConfig({ filepath: `${path}/${viewId}_db.md` });
        }
        const leaf = app.workspace.getLeaf();
        const file = resolve_tfile(filePath);
        this.view = new DatabaseView(leaf, this.plugin, file);
        this.view.initRootContainer(file);
        await this.view.initDatabase();
        LOGGER.debug("Database initialized successfully from project view");
        this.dataEl = contentEl.createDiv().appendChild(this.view.containerEl);
    }

    async onClose() {
        LOGGER.debug("Closing project view ", this.getDisplayName());
    }
}

export default ProjectAPI;