import { RowDataType, TableColumn } from "cdm/FolderModel";
import { InputType, MetadataColumns } from "helpers/Constants";
import { TFile } from "obsidian";
import { DataviewService } from "./DataviewService";
import { Literal } from "obsidian-dataview/lib/data-model/value";
import { LocalSettings } from "cdm/SettingsModel";
import { resolve_tfile } from "helpers/FileManagement";
/**
 * Keep info about a note and offer methods to manipulate it
 */
export default class NoteInfo {
    private filepath: string;
    private page: Record<string, Literal>;
    constructor(page: Record<string, Literal>) {
        this.page = page;
        this.filepath = (page.file as any).path;
    }

    getRowDataType(columns: TableColumn[], config: LocalSettings): RowDataType {
        /** Mandatory fields */
        const aFile: RowDataType = {
            __note__: this
        }
        const dataviewFile = this.page.file as any;
        /** Metadata fields */
        aFile[MetadataColumns.FILE] = `${dataviewFile.link.markdown()}`;
        aFile[MetadataColumns.CREATED] = dataviewFile.ctime;
        aFile[MetadataColumns.MODIFIED] = dataviewFile.mtime;
        aFile[MetadataColumns.TASKS] = dataviewFile.tasks;
        /** Parse data with the type of column */
        columns.forEach(column => {
            if (this.page[column.key] !== undefined) {
                aFile[column.key] = DataviewService.parseLiteral((this.page[column.key]) as Literal, column.input, config, column.config.isInline);
            }
        });
        return aFile;
    }

    getAllRowDataType(config: LocalSettings): RowDataType {
        /** Mandatory fields */
        const aFile: RowDataType = {
            __note__: this
        }
        /** Optional fields */
        /** Parse data with the type of column */
        Object.keys(this.page)
            .filter(key => !["file"].includes(key))
            .forEach(property => {
                const value = DataviewService.parseLiteral((this.page[property]) as Literal, InputType.TEXT, config, false);
                aFile[property] = value;
            });

        return aFile;
    }

    getFile(): TFile {
        return resolve_tfile(this.filepath);
    }
}