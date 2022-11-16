import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import { DEFAULT_SETTINGS, SourceDataTypes } from "helpers/Constants";
import { Notice } from "obsidian";
import { Link, Literal } from "obsidian-dataview";
import { DateTime } from "luxon";
import NoteInfo from "services/NoteInfo";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";
import { VaultManagerDB } from "services/FileManagerService";
import { resolve_tfolder } from "helpers/FileManagement";

export default class SaveDataFromFileHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, set, implementation } = tableActionResponse;
        /**
         * 
         * @param file CSV file to save
         */
        implementation.actions.saveDataFromFile = async (file: File, columns: TableColumn[], config: LocalSettings) => {
            try {
                const reader = new FileReader();
                reader.onload = async (event) => {
                    const csv = event.target.result;
                    const rows = await this.parseCSV(csv, columns, config, view);
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
    async parseCSV(csv: string | ArrayBuffer, columns: TableColumn[], config: LocalSettings, view: DatabaseView): Promise<RowDataType[]> {
        const rows: RowDataType[] = [];
        const lines = csv.toString().split("\n");
        const headers = this.normalizeArray(lines[0].split(","));
        const isCurrentFolder = config.source_data in [SourceDataTypes.CURRENT_FOLDER, SourceDataTypes.CURRENT_FOLDER_WITHOUT_SUBFOLDERS];
        const destination_folder = isCurrentFolder ? view.file.parent.path : config.source_destination_path;
        // Obtain File from headers array
        const fileIndex = headers.indexOf(
            view.plugin.settings.global_settings.csv_file_header_key ?? DEFAULT_SETTINGS.global_settings.csv_file_header_key
        );
        if (fileIndex === -1) {
            throw new Error(`${view.plugin.settings.global_settings.csv_file_header_key} column not found in CSV file`);
        }

        for (let i = 1; i < lines.length; i++) {

            const currentline = this.normalizeArray(lines[i].split(","));
            const potentialPath = currentline[fileIndex];
            // Obtain just the filename from the path
            const sanitizePath = potentialPath?.split("/").pop().split('.');
            let filename = "";
            if (sanitizePath.length > 1) {
                filename = sanitizePath.slice(0, -1).join('.').trim();
            } else {
                filename = sanitizePath[0];
            }
            if (filename) {

                const filepath = isCurrentFolder ? `${view.file.parent.path}/${filename}.md` : `${config.source_destination_path}/${filename}.md`;
                const lineRecord: Record<string, Literal> = {};

                currentline.forEach((value, index) => {
                    lineRecord[headers[index]] = value;
                });

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

                rows.push(newNote.getRowDataType(columns));
            }
        }

        return rows;
    }
    normalizeArray(array: string[]): string[] {
        return array.map((value) => value?.replaceAll("\"", "").trim());
    }
}
