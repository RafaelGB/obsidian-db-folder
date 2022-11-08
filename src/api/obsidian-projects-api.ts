import { DB_ICONS } from "helpers/Constants";
import DBFolderPlugin from "main";

import {
    DatabaseView,
} from 'DatabaseView';
import { LOGGER } from "services/Logger";
import { TFolder } from "obsidian";
import { DataQueryResult, ProjectView, ProjectViewProps } from "obsidian-projects-types";
import { resolve_tfile } from "helpers/FileManagement";

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
    async onOpen({ contentEl, config, saveConfig, }: ProjectViewProps) {
        if (this.isConfigEmpty(config)) {
            // If the config is empty, we need to create a Default 
            const leaf = app.workspace.getLeaf();
            const file = resolve_tfile("pruebas.md");
            this.view = new DatabaseView(leaf, this.plugin, file);
            this.view.initRootContainer(file);
            this.view.initDatabase().then(() => {
                LOGGER.debug("Database initialized successfully from project view");
                this.dataEl = contentEl.createDiv().appendChild(this.view.containerEl);
            });
        }

    }

    async onClose() {
        LOGGER.debug("Closing project view ", this.getDisplayName());
    }

    private isConfigEmpty(config: Record<string, any>): boolean {
        return Object.keys(config).length === 0;
    }
}

export default ProjectAPI;