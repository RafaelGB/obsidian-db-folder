import { DB_ICONS } from "helpers/Constants";
import DBFolderPlugin from "main";
import { DataQueryResult, ProjectView, ProjectViewProps } from "obsidian-projects-types";

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
        return "Database Folder View";
    }

    getIcon(): string {
        return DB_ICONS.NAME;
    }

    async onData({ data, readonly }: DataQueryResult) {
        // Do nothing here
    }

    // onOpens is called whenever the user activates your view.
    //
    // `contentEl`    HTML element where you can attach your view.
    // `config`       JSON object with optional view configuration.
    // `saveConfig`   Callback to save configuration changes.
    async onOpen({ contentEl, config, saveConfig }: ProjectViewProps) {
        const [firstKey] = this.plugin.viewMap.keys();
        const db = this.plugin.viewMap.get(firstKey)

        db.initDatabase().then(() => {
            contentEl.createDiv().appendChild(db.containerEl)
        })
    }

    async onClose() {
        console.log("Closing ", this.getDisplayName());
    }
}

export default ProjectAPI;