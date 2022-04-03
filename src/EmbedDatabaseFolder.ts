import {
    MarkdownRenderChild,
    App,
    MarkdownRenderer
} from "obsidian";

import { TableDataType } from 'cdm/FolderModel';

import { 
	Settings
} from 'Settings';

import {
    createTable
} from 'components/Index';

import {
    obtainColumnsFromFolder
} from 'components/Columns';
import {
    adapterTFilesToRows
} from 'helpers/VaultManagement';

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
        // Add a table to the container
        const tableContainer  = this.container.createDiv("dbfolder-embed-table-container");
        let folder = this.db_yaml.folder;
        let columns = obtainColumnsFromFolder();
        // Obtain rows from file notes inside the folder selected
        let rows = await adapterTFilesToRows(this.app,folder);
        const tableProps:TableDataType = { // make sure all required component's inputs/Props keys&types match
            columns: columns,
            data: rows,
            skipReset: false
          }
        let table = createTable(tableProps,this.app);
        ReactDOM.render(table, tableContainer);
    }
}