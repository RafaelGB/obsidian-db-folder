import { RowDatabaseFields } from "cdm/DatabaseModel";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import { MetadataColumns, UpdateRowOptions } from "helpers/Constants";
import { updateRowFileProxy } from "helpers/VaultManagement";
import { DateTime } from "luxon";
import { Literal } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
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
            updateCell: (rowIndex: number, column: TableColumn, value: Literal, columns: TableColumn[], ddbbConfig: LocalSettings) => set((state) => {
                const rowTFile = state.rows[rowIndex].__note__.getFile();
                // Save on disk
                updateRowFileProxy(
                    rowTFile,
                    column.id,
                    value,
                    columns,
                    ddbbConfig,
                    UpdateRowOptions.COLUMN_VALUE
                );

                // Update row in memory
                const row = { ...state.rows[rowIndex] };
                row[column.key] = value;
                row[MetadataColumns.MODIFIED] = DateTime.now();
                return { rows: [...state.rows.slice(0, rowIndex), row, ...state.rows.slice(rowIndex + 1)] };
            }
            ),
            parseDataOfColumn: (column: TableColumn, input: string, ddbbConfig: LocalSettings) => {
                set((updater) => {
                    const parsedRows = updater.rows.map((row) => ({
                        ...row,
                        [column.id]: DataviewService.parseLiteral(
                            row[column.id] as Literal,
                            input, // Destination type to parse
                            ddbbConfig
                        ),
                    }));
                    return { rows: parsedRows };
                }
                );
            },
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
/**
 * case ActionTypes.UPDATE_CELL:
      // Obtain current column index
      const update_cell_index = state.view.columns.findIndex(
        (column) => column.id === action.columnId
      );
      // Save on disk
      updateRowFileProxy(
        action.file,
        action.key,
        action.value,
        action.state,
        UpdateRowOptions.COLUMN_VALUE
      );
      const update_option_cell_column_key =
        state.view.columns[update_cell_index].key;
      return update(state, {
        view: {
          rows: {
            [action.row.index]: {
              $merge: {
                [update_option_cell_column_key]: action.value,
              },
            },
          },
        },
      });
 */