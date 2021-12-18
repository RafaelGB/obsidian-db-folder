import {
    App,
    MarkdownRenderChild
} from "obsidian";

/**
 * Render a search bar of notes into a folder path with filters
 */
export class DBFolderSearchRenderer extends MarkdownRenderChild {
    constructor(
        public container: HTMLElement
    ) {
        super(container);
    }

    async onload() {
        await this.render();
    }

    async render() {
        console.log('->render dbfolder search');
        this.container.createEl("h2", { text: "DBFolder" });
        this.container.createEl("h3", { text: "Search" });

        const searchEl = this.container.createEl("input", {
            type: "text"
        });
        const searchButton = this.container.createEl("button", {
            text: "Search"
        });

        searchButton.addEventListener("click", async () => {
            const search = searchEl.value;
            console.log(search);
        });
        console.log('<-render dbfolder search');
    }
    
}