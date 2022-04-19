import { TableRow } from "cdm/FolderModel";
import { MetadataColumns } from "helpers/Constants";
import { TFile } from "obsidian";

export default class DatabaseInfo {
    public file:TFile;
    private page: Record<string, any>;
    private id:number;
    constructor(page: Record<string, any>, id:number) {
        this.page = page;
        this.file = page.file;
        this.id = id;
    }

    getTableRow():TableRow{
        /** Mandatory fields */
        const aFile: TableRow = {
            id: this.id,
            note: this
        }
        /** Metadata fields */
        aFile[MetadataColumns.FILE]=`${this.page.file.link.markdown()}`
        /** Optional fields */
        Object.keys(this.page).forEach(property => {
            const value = this.page[property];
            if (value && typeof value !== 'object') {
                aFile[property] = value;
            }
        });
        return aFile;
    }
}