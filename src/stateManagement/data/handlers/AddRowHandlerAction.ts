import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { destination_folder, resolve_tfolder } from "helpers/FileManagement";
import { DateTime } from "luxon";
import { Link } from "obsidian-dataview";
import { VaultManagerDB } from "services/FileManagerService";
import NoteInfo from "services/NoteInfo";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AddRowlHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, set, get, implementation } = tableActionResponse;
        implementation.actions.addRow = async (filename: string, columns: TableColumn[], ddbbConfig: LocalSettings) => {
            const folderPath = destination_folder(view, ddbbConfig);
            let trimedFilename = filename.replace(/\.[^/.]+$/, "").trim();
            let filepath = `${folderPath}/${trimedFilename}.md`;
            // Validate possible duplicates
            let sufixOfDuplicate = 0;
            while (get().rows.find((row) => row.__note__.filepath === filepath)) {
                sufixOfDuplicate++;
                filepath = `${folderPath}/${trimedFilename}-${sufixOfDuplicate}.md`;
            }
            if (sufixOfDuplicate > 0) {
                trimedFilename = `${trimedFilename}-${sufixOfDuplicate}`;
                filename = `${trimedFilename} copy(${sufixOfDuplicate})`;
            }
            // Add note to persist row
            await VaultManagerDB.create_markdown_file(
                resolve_tfolder(folderPath),
                trimedFilename,
                ddbbConfig
            );

            const newNote = new NoteInfo({
                file: {
                    path: filepath,
                    ctime: DateTime.now(),
                    mtime: DateTime.now(),
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

            const row: RowDataType = newNote.getRowDataType(columns);
            set((state) => {

                return { rows: [...state.rows, row] }
            })
        };
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}