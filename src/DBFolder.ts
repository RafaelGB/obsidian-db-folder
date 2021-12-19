import {
    App,
    MarkdownRenderChild
} from "obsidian";

import { 
	Settings
} from 'Settings';

import {
    AttachToAllClassDecorator
} from 'decorators/BaseDecorator'

/**
 * Render a search bar of notes into a folder path with filters
 */
export class DBFolderSearchRenderer extends MarkdownRenderChild {
    
    constructor(
        public container: HTMLElement,
        public settings: Settings
    ) {
        super(container);
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
    }
    
}