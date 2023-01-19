import { DataApi } from "api/data-api";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { destination_folder } from "helpers/FileManagement";
import { DateTime } from "luxon";
import { Link } from "obsidian-dataview";
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

    read(id: string): Promise<RowDataType> {
        throw new Error("Method not implemented.");
    }

    update(entity: RowDataType): Promise<boolean> {
        throw new Error("Method not implemented.");
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
}

export default DefaultDataImpl;