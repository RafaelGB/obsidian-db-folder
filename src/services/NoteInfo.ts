import { RowDataType, TableColumn } from "cdm/FolderModel";
import { MetadataColumns } from "helpers/Constants";
import { TFile } from "obsidian";
import { VaultManagerDB } from "services/FileManagerService";
import { DateTime } from "luxon";
import { DataviewService } from "./DataviewService";
import { Literal } from "obsidian-dataview/lib/data-model/value";
/**
 * Keep info about a note and offer methods to manipulate it
 */
export default class NoteInfo {
    private filepath: string;
    private page: Record<string, any>;
    private id: number;
    constructor(page: Record<string, any>, id: number) {
        this.page = page;
        this.filepath = page.file.path;
        this.id = id;
    }

    getRowDataType(columns: TableColumn[]): RowDataType {
        /** Mandatory fields */
        const aFile: RowDataType = {
            id: this.id,
            note: this
        }
        /** Metadata fields */
        aFile[MetadataColumns.FILE] = `${this.page.file.link.markdown()}`;
        aFile[MetadataColumns.CREATED] = this.page.file.ctime;
        aFile[MetadataColumns.MODIFIED] = this.page.file.mtime;

        /** Optional fields */
        Object.keys(this.page).forEach(property => {
            const value = this.page[property];
            aFile[property] = value;
        });
        /** Parse data with the type of column */
        columns.forEach(column => {
            if (aFile[column.key] !== undefined) {
                aFile[column.key] = DataviewService.parseLiteral((aFile[column.key]) as Literal, column.dataType);
            }
        });
        return aFile;
    }

    getFile(): TFile {
        return VaultManagerDB.obtainTfileFromFilePath(this.filepath);
    }
}