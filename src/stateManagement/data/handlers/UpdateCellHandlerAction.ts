import { TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { MetadataColumns, UpdateRowOptions } from "helpers/Constants";
import { moveFile, updateRowFileProxy } from "helpers/VaultManagement";
import { Literal } from "obsidian-dataview";
import { DateTime } from "luxon";
import NoteInfo from "services/NoteInfo";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class UpdateCellHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.updateCell = (rowIndex: number, column: TableColumn, value: Literal, columns: TableColumn[], ddbbConfig: LocalSettings, isMovingFile?: boolean) => set((state) => {
            const row = { ...state.rows[rowIndex] };
            row[column.key] = value;
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
        });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}