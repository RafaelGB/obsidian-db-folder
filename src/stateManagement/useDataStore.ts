import { RowDatabaseFields } from "cdm/DatabaseModel";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import { MetadataColumns, UpdateRowOptions } from "helpers/Constants";
import { dbTrim } from "helpers/StylesHelper";
import { moveFile, updateRowFileProxy } from "helpers/VaultManagement";
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
            updateCell: (rowIndex: number, column: TableColumn, value: Literal, columns: TableColumn[], ddbbConfig: LocalSettings, isMovingFile?: boolean) => set((state) => {
                const row = { ...state.rows[rowIndex] };
                row[column.key] = value;
                console.log(ddbbConfig.show_metadata_modified);
                if (ddbbConfig.show_metadata_modified) {
                    row[MetadataColumns.MODIFIED] = DateTime.now();
                }
                let rowTFile = state.rows[rowIndex].__note__.getFile();
                if (isMovingFile && ddbbConfig.group_folder_column === column.id) {
                    const moveInfo = {
                        file: rowTFile,
                        id: column.id,
                        value: value,
                        columns: columns,
                        ddbbConfig: ddbbConfig,
                    }
                    moveFile(`${view.file.parent.path}/${value}`, moveInfo);
                    // Update row file
                    row[
                        MetadataColumns.FILE
                    ] = `[[${view.file.parent.path}/${value}/${rowTFile.name}|${rowTFile.basename}]]`;
                    // Check if action.value is a valid folder name
                    const auxPath =
                        value !== ""
                            ? `${view.file.parent.path}/${value}/${rowTFile.name}`
                            : `${view.file.parent.path}/${rowTFile.name}`;

                    row.__note__ = new NoteInfo({
                        ...row,
                        file: {
                            path: auxPath,
                        },
                    });
                    // Update rows
                    return { rows: [...state.rows.slice(0, rowIndex), row, ...state.rows.slice(rowIndex + 1)] };
                }

                // Save on disk
                updateRowFileProxy(
                    rowTFile,
                    column.id,
                    value,
                    columns,
                    ddbbConfig,
                    UpdateRowOptions.COLUMN_VALUE
                );

                return { rows: [...state.rows.slice(0, rowIndex), row, ...state.rows.slice(rowIndex + 1)] };
            }
            ),
            updateDataAfterLabelChange: (column: TableColumn, label: string, columns: TableColumn[], ddbbConfig: LocalSettings) => set((state) => {
                const newKey = dbTrim(label);
                // Save on disk
                Promise.all(
                    state.rows.map(async (row: RowDataType) => {
                        updateRowFileProxy(
                            row.__note__.getFile(),
                            column.id,
                            newKey,
                            columns,
                            ddbbConfig,
                            UpdateRowOptions.COLUMN_KEY
                        );
                    }));

                // Save on memory
                const alterRows = state.rows.map((row) => {
                    row[newKey] = row[column.id];
                    delete row[column.id];
                    return row;
                });

                return { rows: alterRows };
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
 * case ActionTypes.UPDATE_COLUMN_LABEL:
      const update_column_label_index = state.view.columns.findIndex(
        (column: any) => column.id === action.columnId
      );

      // Update configuration & row files on disk
      state.view.diskConfig.updateColumnKey(
        action.columnId,
        action.newKey,
        action.label
      );
      // Promise.all(
      //   state.view.rows.map(async (row: RowDataType) => {
      //     await updateRowFileProxy(
      //       row.__note__.getFile(),
      //       action.columnId,
      //       action.newKey,
      //       action.state,
      //       UpdateRowOptions.COLUMN_KEY
      //     );
      //   })
      // );
      return update(state, {
        skipReset: { $set: true },
        // Modify column visually with the new label
        view: {
          columns: {
            $set: [
              ...state.view.columns.slice(0, update_column_label_index),
              {
                ...state.view.columns[update_column_label_index],
                label: action.label,
                id: action.newKey,
                key: action.newKey,
                accessorKey: action.newKey,
              },
              ...state.view.columns.slice(
                update_column_label_index + 1,
                state.view.columns.length
              ),
            ],
          },
          // Modify data visually with the new key
          rows: {
            $set: state.view.rows.map((row: RowDataType) => {
              row[action.newKey] = row[action.columnId];
              delete row[action.columnId];
              return row;
            }),
          },
          // Update view yaml state
          diskConfig: {
            yaml: {
              $set: state.view.diskConfig.yaml,
            },
          },
        },
      });
 */