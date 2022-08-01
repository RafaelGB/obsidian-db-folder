import { RowDatabaseFields } from "cdm/DatabaseModel";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import { MetadataColumns } from "helpers/Constants";
import { DateTime } from "luxon";
import { Literal } from "obsidian-dataview";
import { VaultManagerDB } from "services/FileManagerService";
import NoteInfo from "services/NoteInfo";
import create from "zustand";

const useDataStore = (view: DatabaseView) => {
    return create<DataState>()(
        (set) => ({
            rows: view.rows,
            addRow: (filename: string, columns: TableColumn[], ddbbConfig: LocalSettings) => set((state) => {
                const filepath = `${view.file.parent.path}/${filename}.md`;
                const rowRecord: RowDatabaseFields = { inline: {}, frontmatter: {} };
                columns
                    .filter((column: TableColumn) => !column.isMetadata)
                    .forEach((column: TableColumn) => {
                        if (column.config.isInline) {
                            rowRecord.inline[column.key] = "";
                        } else {
                            rowRecord.frontmatter[column.key] = "";
                        }
                    });
                // Add note to persist row
                VaultManagerDB.create_markdown_file(
                    view.file.parent,
                    filename,
                    rowRecord,
                    ddbbConfig
                );
                const metadata: Record<string, Literal> = {};
                metadata[MetadataColumns.CREATED] = DateTime.now();
                metadata[MetadataColumns.MODIFIED] = DateTime.now();
                metadata[MetadataColumns.TASKS] = ""; // Represents the tasks for the row as empty
                const row: RowDataType = {
                    ...rowRecord.frontmatter,
                    ...rowRecord.inline,
                    ...metadata,
                    __note__: new NoteInfo({
                        ...rowRecord.frontmatter,
                        ...rowRecord.inline,
                        file: { path: filename },
                    }),
                    [MetadataColumns.FILE]: `[[${filepath}|${filename}]]`,
                };
                return { rows: [...state.rows, row] }
            }),
            removeRow: (row: RowDataType) => set((state) => ({ rows: state.rows.filter((r) => r.__note__.getFile().path !== row.__note__.getFile().path) })),
            removeDataOfColumn: (column: TableColumn) => set((state) => {
                const newRows = [...state.rows];
                newRows.forEach((row) => {
                    delete row[column.id];
                }
                );
                return { rows: newRows };
            }),
        }),
    );
}
export default useDataStore;