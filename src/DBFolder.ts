import {
    MetadataCache, 
    TFile,
    Vault,
    MarkdownRenderChild
} from "obsidian";

import { 
	Settings
} from 'Settings';

import {
    ReactSample
} from 'components/Table';

/**
 * Render a search bar of notes into a folder path with filters
 */
export class DBFolderSearchRenderer extends MarkdownRenderChild {
    
    constructor(
        public container: HTMLElement,
        public db_yaml: any,
        public sourcePath: string,
        public settings: Settings
    ) {
        super(container);
        console.log("Ruta origen", sourcePath);
    }

    async onload() {
        await this.render();
    }

    async render() {
        this.container.createEl("h2", { text: "DBFolder" });
        this.container.createEl("h3", { text: "Search" });

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
        
        // TODO obtain current file
        // TODO generate a factory of renderers with unique id
        // TODO use de result of the search to filter the files inside db_yaml defined folder
    }
    
}