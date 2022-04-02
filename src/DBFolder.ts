import {
    MarkdownRenderChild,
    App,
    MarkdownRenderer
} from "obsidian";

import { 
	Settings
} from 'Settings';

import {
    createTable
} from 'components/Index';

import {
    adapterTFilesToRows,
    obtainCurrentFolder
} from 'cross/VaultManagement';

import ReactDOM from 'react-dom';
/**
 * Render a search bar of notes into a folder path with filters
 */
export class DBFolderListRenderer extends MarkdownRenderChild {
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

    async onunload() {
        // TODO improve this
        this.container.innerHTML = "";
    }

    async render() {
        this.container.createEl("h3", { text: this.db_yaml.title });
        
        const lab = this.container.createDiv("dbfolder-lab");
        await MarkdownRenderer.renderMarkdown(
            "[[readme]]",
            lab,
            "readme.md",
            null
        );
        // Add a table to the container
        
        const tableContainer  = this.container.createDiv("dbfolder-table-container");
        let folder = obtainCurrentFolder(this.app)+this.db_yaml.folder;
        let rows = await adapterTFilesToRows(this.app,folder);
        let table = createTable(rows,this.app);
        ReactDOM.render(table, tableContainer);
    }
}