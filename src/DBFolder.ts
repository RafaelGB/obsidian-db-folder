import {
    MarkdownRenderChild,
    App
} from "obsidian";

import { 
	Settings
} from 'Settings';

import {
    createTable
} from 'components/Table';

import {
    obtainTFilesFromTFolder,
    obtainCurrentFolder
} from 'utils/VaultManagement';
/**
 * Render a search bar of notes into a folder path with filters
 */
export class DBFolderSearchRenderer extends MarkdownRenderChild {
    constructor(
        public container: HTMLElement,
        public db_yaml: any,
        public sourcePath: string,
        public settings: Settings,
        public app: App
    ) {
        super(container);
    }

    async onload() {
        await this.render();
    }

    async render() {
        this.container.createEl("h3", { text: this.db_yaml.title });

        const searchEl = this.container.createEl("input", {
            type: "text"
        });
        const searchButton = this.container.createEl("button", {
            text: "Search"
        });

        searchButton.addEventListener("click", async () => {
            const searchResult = searchEl.value;
            console.log(searchResult);
        });
        // Add a table to the container
        
        const tableContainer  = this.container.createDiv("table-container");
        let folder = obtainCurrentFolder(this.app)+this.db_yaml.folder;
        console.log(folder);
        let files = obtainTFilesFromTFolder(this.app,folder);
        createTable(tableContainer,files);
        // TODO obtain current file
        // TODO generate a factory of renderers with unique id
        // TODO use de result of the search to filter the files inside db_yaml defined folder
    }
    
}