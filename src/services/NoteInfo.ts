import { RowDataType, TableColumn } from "cdm/FolderModel";
import { MetadataColumns } from "helpers/Constants";
import { TFile } from "obsidian";
import { resolve_tfile } from "helpers/FileManagement";
import { NoteInfoPage } from "cdm/DatabaseModel";
import { DataviewService } from "./DataviewService";
/**
 * Keep info about a note and offer methods to manipulate it
 */

export default class NoteInfo {
    public filepath: string;
    private page: NoteInfoPage;
    constructor(page: NoteInfoPage) {
        this.page = page;
        this.filepath = page.file.path;
    }

    getRowDataType(columns: TableColumn[]): RowDataType {
        /** Mandatory fields */
        const aFile: RowDataType = {
            __note__: this
        }
        const dataviewFile = this.page;
        dataviewFile
        /** Metadata fields */
        aFile[MetadataColumns.FILE] = dataviewFile.file.link;
        aFile[MetadataColumns.CREATED] = dataviewFile.file.ctime;
        aFile[MetadataColumns.MODIFIED] = dataviewFile.file.mtime;
        aFile[MetadataColumns.TASKS] = dataviewFile.file.tasks;
        aFile[MetadataColumns.OUTLINKS] = dataviewFile.file.outlinks;
        aFile[MetadataColumns.INLINKS] = dataviewFile.file.inlinks;
        /** Parse data with the type of column */

        columns
            // filter duplicate columns in function of the id
            .filter((column, index, self) =>
                index === self.findIndex((t) => (
                    t.id === column.id
                ))
                // Map row data type
            ).forEach(column => {
                if (dataviewFile[column.key] !== undefined) {
                    aFile[column.key] = dataviewFile[column.key];
                }
            });
        return aFile;
    }

    getAllRowDataType(): RowDataType {
        /** Mandatory fields */
        const aFile: RowDataType = {
            __note__: this
        }
        /** Optional fields */
        const record = DataviewService.getDataviewAPI().page(this.filepath);
        /** Parse data with the type of column */
        Object.keys(record)
            .filter(key => !["file"].includes(key))
            .forEach(property => {
                aFile[property] = record[property];
            });
        return aFile;
    }

    getFile(): TFile {
        return resolve_tfile(this.filepath);
    }
}