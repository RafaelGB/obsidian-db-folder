import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { DatabaseView } from "views/DatabaseView";
import { DEFAULT_SETTINGS, SourceDataTypes } from "helpers/Constants";
import { Notice } from "obsidian";
import { Link, Literal } from "obsidian-dataview";
import { DateTime } from "luxon";
import NoteInfo from "services/NoteInfo";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";
import { VaultManagerDB } from "services/FileManagerService";
import { resolve_tfolder } from "helpers/FileManagement";
import { CsvService } from "IO/csv/CsvService";

export default class ImportRowsFromCSVHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, set, implementation } = tableActionResponse;
        /**
         * 
         * @param file CSV file to save
         */
        implementation.actions.importRowsFromCSV = async (file: File, columns: TableColumn[], config: LocalSettings) => {
            try {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const csv = event.target.result;
                    const rows = await this.importRows(csv, columns, config, view);
                    new Notice(`Saved ${rows.length} rows from ${file.name}`);
                    set((state) => {
                        return {
                            rows: [...state.rows, ...rows]
                        }
                    });
                }
                reader.readAsText(file);
            } catch (error) {
                new Notice(`Error: Could not save data from file. ${error}`, 3000);
            }

        };
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);

    }

    async importRows(
        csv: string | ArrayBuffer,
        columns: TableColumn[],
        config: LocalSettings,
        view: DatabaseView
    ): Promise<RowDataType[]> {
        const rows: RowDataType[] = [];
        const csvLines = CsvService.parseCSV(csv);

        const localSources = [
            SourceDataTypes.CURRENT_FOLDER,
            SourceDataTypes.CURRENT_FOLDER_WITHOUT_SUBFOLDERS
        ] as string[];
        const isCurrentFolder = localSources.contains(config.source_data);
        const destination_folder = isCurrentFolder ? view.file.parent.path : config.source_destination_path;

        const fileKey = view.plugin.settings.global_settings.csv_file_header_key ?? DEFAULT_SETTINGS.global_settings.csv_file_header_key;
        csvLines.forEach(async (lineRecord: Record<string, Literal>) => {
            const fileColumn = lineRecord[fileKey];
            // Obtain just the filename from the path
            const sanitizePath = fileColumn?.toString().split("/").pop().split('.');
            let filename = "";
            if (sanitizePath.length > 1) {
                filename = sanitizePath.slice(0, -1).join('.').trim();
            } else {
                filename = sanitizePath[0];
            }

            if (filename) {
                const filepath = isCurrentFolder ? `${view.file.parent.path}/${filename}.md` : `${config.source_destination_path}/${filename}.md`;
                await VaultManagerDB.create_markdown_file(
                    resolve_tfolder(destination_folder),
                    filename,
                    config,
                    {
                        frontmatter: lineRecord,
                        inline: {}
                    },
                );
                const newNote = new NoteInfo({
                    ...lineRecord,
                    file: {
                        path: filepath,
                        folder: destination_folder,
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

                const rowDataType = newNote.getRowDataType(columns);
                rows.push(rowDataType);
            }
        });

        return rows;
    }
    normalizeArray(array: string[]): string[] {
        return array.map((value) => value?.replaceAll("\"", "").trim());
    }
}
