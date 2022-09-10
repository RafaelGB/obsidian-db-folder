import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import { SourceDataTypes } from "helpers/Constants";
import { Notice } from "obsidian";
import { Literal } from "obsidian-dataview";
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
        const headers = lines[0].split(",");
        const destination_folder = config.source_data === SourceDataTypes.CURRENT_FOLDER ? view.file.parent.path : config.source_destination_path;
        // Obtain File from headers array
        const fileIndex = headers.indexOf("File");
        if (fileIndex === -1) {
            throw new Error("File column not found in CSV file");
        }

        for (let i = 1; i < lines.length; i++) {

            const currentline = lines[i].split(",");
            const potentialPath = currentline[fileIndex];
            currentline.splice(fileIndex, 1);
            // Obtain just the filename from the path
            const filename = potentialPath.split("/").pop().replace(/(\.\w+)+$/, "").trim();

            if (filename) {
                const filepath = config.source_data === SourceDataTypes.CURRENT_FOLDER ? `${view.file.parent.path}/${filename}.md` : `${config.source_destination_path}/${filename}.md`;
                const lineRecord: Record<string, Literal> = {};
                currentline.forEach((value, index) => {
                    lineRecord[headers[index]] = value;
                });

                await VaultManagerDB.create_markdown_file(
                    resolve_tfolder(destination_folder),
                    filename,
                    {
                        frontmatter: lineRecord,
                        inline: {}
                    },
                    config
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
                        },
                        tasks: [],
                    },
                });

                rows.push(newNote.getRowDataType(columns, config));
            }
        }

        return rows;
    }
}
