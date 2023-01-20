import { DataApi, UpdateApiInfo } from "api/data-api";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { UpdateRowInfo } from "cdm/TableStateInterface";
import { MetadataColumns, UpdateRowOptions } from "helpers/Constants";
import { destination_folder, resolveNewFilePath, resolve_tfile } from "helpers/FileManagement";
import { DateTime } from "luxon";
import { Link } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { EditEngineService } from "services/EditEngineService";
import { FileGroupingService } from "services/FileGroupingService";
import { VaultManagerDB } from "services/FileManagerService";
import { LOGGER } from "services/Logger";
import NoteInfo from "services/NoteInfo";

class DefaultDataImpl extends DataApi {
    async create(filename: string, columns: TableColumn[], ddbbConfig: LocalSettings) {
        const folderPath = destination_folder(this.view, ddbbConfig);
        const filepath = await VaultManagerDB.create_row_file(folderPath, filename, ddbbConfig);

        const newNote = new NoteInfo({
            file: {
                path: filepath,
                ctime: DateTime.now(),
                mtime: DateTime.now(),
                folder: folderPath,
                link: {
                    path: filepath,
                    fileName: () => filename,
                    type: "file",
                    embed: false,
                    equals: (link: Link) => link.path === filepath,
                    toObject: () => ({ path: filepath }),
                    withPath: null,
                    withDisplay: null,
                    withHeader: null,
                    toEmbed: null,
                    toFile: null,
                    markdown: () => `[[${filepath}|${filename}]]`,
                    fromEmbed: null,
                    obsidianLink: () => `[[${filepath}|${filename}]]`,
                },
                tasks: [],
                inlinks: [],
                outlinks: [],
            },
        });

        return newNote.getRowDataType(columns);
    }

    async update({
        value,
        ddbbConfig,
        isMovingFile,
        column,
        columns,
        action }: UpdateApiInfo,
        modifiedRow: RowDataType): Promise<boolean> {
        try {
            const pathColumns =
                ddbbConfig.group_folder_column
                    .split(",")
                    .filter(Boolean);
            // Update the row on disk
            if (isMovingFile && pathColumns.includes(column.key)) {
                const folderPath = destination_folder(this.view, ddbbConfig);
                const newFilePath = resolveNewFilePath({
                    pathColumns,
                    row: modifiedRow,
                    ddbbConfig,
                    folderPath,
                });
                await FileGroupingService.moveFile(newFilePath, modifiedRow);
                await FileGroupingService.removeEmptyFolders(folderPath, ddbbConfig);
            }

            await EditEngineService.updateRowFileProxy(
                modifiedRow.__note__.getFile(),
                column.key,
                value,
                columns,
                ddbbConfig,
                action
            );
        } catch (e) {
            LOGGER.error("Error updating row", e);
            return false;
        }
        return true;
    }

    async delete(rowToRemove: RowDataType): Promise<boolean> {
        try {
            await VaultManagerDB.removeNote(rowToRemove.__note__.getFile());
        } catch (e) {
            LOGGER.error("Error deleting note", e);
            return false;
        }
        return true;
    }

    async rename(rowToRename: RowDataType, newName: string): Promise<RowDataType> {
        const fileLink = rowToRename[MetadataColumns.FILE] as Link;
        const oldTfile = resolve_tfile(fileLink.path);
        const newPath = `${oldTfile.parent.path}/${newName}.md`;
        await app.vault.rename(oldTfile, newPath);
        rowToRename.__note__.filepath = newPath;
        rowToRename[MetadataColumns.FILE] = DataviewService.getDataviewAPI().fileLink(newPath);
        return rowToRename;
    }

    async duplicate(rowToDuplicate: RowDataType): Promise<boolean> {
        try {
            await VaultManagerDB.duplicateNote(rowToDuplicate.__note__.getFile());
        } catch (e) {
            LOGGER.error("Error duplicating note", e);
            return false;
        }
        return true;
    }
}

export default DefaultDataImpl;