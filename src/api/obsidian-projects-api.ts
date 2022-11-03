import { DB_ICONS } from "helpers/Constants";
import DBFolderPlugin from "main";
import { DataQueryResult, ProjectView, ProjectViewProps } from "obsidian-projects-types";
import {
    DatabaseView,
} from 'DatabaseView';
import { LOGGER } from "services/Logger";
import { TFolder } from "obsidian";

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

    async onData({ data, readonly }: DataQueryResult) {
        // Do nothing here
        // Data is handled by the database itself and will be updated automatically every time the view is opened


    }

    // onOpens is called whenever the user activates your view.
    //
    // `contentEl`    HTML element where you can attach your view.
    // `config`       JSON object with optional view configuration.
    // `saveConfig`   Callback to save configuration changes.
    async onOpen({ contentEl, config, saveConfig }: ProjectViewProps) {
        if (!this.view) {
            // TODO Asociate the view with the plugin
            const [firstKey] = this.plugin.viewMap.keys();
            this.view = this.plugin.viewMap.get(firstKey)
        }

        this.view.initDatabase().then(() => {
            LOGGER.debug("Database initialized successfully from project view");
            this.dataEl = contentEl.createDiv().appendChild(this.view.containerEl);
        })
    }

    async onClose() {
        LOGGER.debug("Closing project view ", this.getDisplayName());
    }

    private generateDataview(folder: TFolder) {
        new DatabaseView(app.workspace.getMostRecentLeaf(), this.plugin)
    }
}

export default ProjectAPI;