import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { create_row_file, destination_folder } from "helpers/FileManagement";
import { DateTime } from "luxon";
import { Link } from "obsidian-dataview";
import NoteInfo from "services/NoteInfo";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AddRowlHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.addRow = async (filename: string, columns: TableColumn[], ddbbConfig: LocalSettings) => {
            const folderPath = destination_folder(view, ddbbConfig);
            const filepath = await create_row_file(folderPath, filename, ddbbConfig);

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
