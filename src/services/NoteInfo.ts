import { RowDataType } from "cdm/FolderModel";
import { MetadataColumns } from "helpers/Constants";
import { TFile } from "obsidian";
import { VaultManagerDB } from "services/FileManagerService";
import { DateTime } from "luxon";
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

    getRowDataType(): RowDataType {
        /** Mandatory fields */
        const aFile: RowDataType = {
            id: this.id,
            note: this
        }
        /** Metadata fields */
        aFile[MetadataColumns.FILE] = `${this.page.file.link.markdown()}`;
        aFile[MetadataColumns.CREATED] = DateTime.fromISO(this.page.file.ctime).toFormat('yyyy-MM-dd');
        aFile[MetadataColumns.MODIFIED] = DateTime.fromISO(this.page.file.mtime).toFormat('yyyy-MM-dd');

        /** Optional fields */
        Object.keys(this.page).forEach(property => {
            const value = this.page[property];
            if (value && typeof value !== 'object') {
                aFile[property] = value;
            }
        });
        return aFile;
    }

    getFile(): TFile {
        return VaultManagerDB.obtainTfileFromFilePath(this.filepath);
    }
}