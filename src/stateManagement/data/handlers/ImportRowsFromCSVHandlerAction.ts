import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { DatabaseView } from "views/DatabaseView";
import { DEFAULT_SETTINGS, InputType, SourceDataTypes } from "helpers/Constants";
import { Notice } from "obsidian";
import { DataObject, Link, Literal } from "obsidian-dataview";
import { DateTime } from "luxon";
import NoteInfo from "services/NoteInfo";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";
import { VaultManagerDB } from "services/FileManagerService";
import { resolve_tfolder } from "helpers/FileManagement";
import * as Papa from "papaparse";
import { ParseService } from "services/ParseService";

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
    parseCSV(csv: string | ArrayBuffer): DataObject[] {
        let parsed = Papa.parse(csv.toString(), {
            header: true,
            skipEmptyLines: true,
            comments: "#",
            dynamicTyping: true,
        });

        const rows = [];
        for (const parsedRow of parsed.data) {
            const fields = this.parseFrontmatter(parsedRow) as DataObject;
            const result: DataObject = {};

            for (const [key, value] of Object.entries(fields)) {
                result[key] = value;
            }

            rows.push(result);
        }
        return rows;
    }

    async importRows(csv: string | ArrayBuffer, columns: TableColumn[], config: LocalSettings, view: DatabaseView): Promise<RowDataType[]> {
        const rows: RowDataType[] = [];

        const csvLines = this.parseCSV(csv);

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

    /** Recursively convert frontmatter into fields. We have to dance around YAML structure. */
    parseFrontmatter(value: any): Literal {
        if (value == null) {
            return null;
        } else if (typeof value === "object") {
            if (Array.isArray(value)) {
                let result = [];
                for (let child of value as Array<any>) {
                    result.push(this.parseFrontmatter(child));
                    result.push(this.parseFrontmatter(child));
                }

                return result;
            } else {
                let object = value as Record<string, any>;
                let result: Record<string, Literal> = {};
                for (let key in object) {
                    result[key] = this.parseFrontmatter(object[key]);
                    result[key] = this.parseFrontmatter(object[key]);
                }

                return result;
            }
        } else if (typeof value === "number") {
            return value;
        } else if (typeof value === "boolean") {
            return value;
        } else if (typeof value === "string") {
            return ParseService.parseLiteral(value, InputType.TEXT, DEFAULT_SETTINGS.local_settings)
        }
        // Backup if we don't understand the type.
        return null;
    }
}
