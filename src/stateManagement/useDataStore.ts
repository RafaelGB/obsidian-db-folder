import { RowDatabaseFields } from "cdm/DatabaseModel";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import { MetadataColumns, UpdateRowOptions } from "helpers/Constants";
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
 * 
 * dispatch({
      type: ActionTypes.UPDATE_OPTION_CELL,
      file: note.getFile(),
      key: tableColumn.key,
      value: option.label,
      row: row,
      columnId: column.id,
      state: table.options.meta,
    });


    
 * case ActionTypes.UPDATE_OPTION_CELL:
      // check if this column is configured as a group folder
      if (dbconfig.group_folder_column === action.key) {
        moveFile(`${state.view.file.parent.path}/${action.value}`, action);
        action.row[
          MetadataColumns.FILE
        ] = `[[${state.view.file.parent.path}/${action.value}/${action.file.name}|${action.file.basename}]]`;
        // Check if action.value is a valid folder name
        const auxPath =
          action.value !== ""
            ? `${state.view.file.parent.path}/${action.value}/${action.file.name}`
            : `${state.view.file.parent.path}/${action.file.name}`;

        action.row.original.__note__ = new NoteInfo({
          ...action.row,
          file: {
            path: auxPath,
          },
        });
        // Update original cell value
        const update_option_cell_index = state.view.columns.findIndex(
          (column) => column.id === action.columnId
        );
        const update_option_cell_column_key =
          state.view.columns[update_option_cell_index].key;
        return update(state, {
          view: {
            rows: {
              [action.row.index]: {
                $merge: {
                  [MetadataColumns.FILE]: action.row[MetadataColumns.FILE],
                  note: action.row.original.__note__,
                  [update_option_cell_column_key]: action.value,
                },
              },
            },
          },
        });
      }
      break;
 */