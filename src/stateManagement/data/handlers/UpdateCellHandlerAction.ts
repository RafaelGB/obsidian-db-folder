import { TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { MetadataColumns, UpdateRowOptions } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { DateTime } from "luxon";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";
import { destination_folder, resolveNewFilePath } from "helpers/FileManagement";
import { EditEngineService } from "services/EditEngineService";
import { FileGroupingService } from "services/FileGroupingService";

export default class UpdateCellHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, set, get, implementation } = tableActionResponse;
        implementation.actions.updateCell = async (
            rowIndex: number,
            column: TableColumn,
            value: Literal,
            columns: TableColumn[],
            ddbbConfig: LocalSettings,
            isMovingFile?: boolean) => {
            const modifiedRow = get().rows[rowIndex];
            let rowTFile = modifiedRow.__note__.getFile();

            // Update the row on memory
            modifiedRow[column.key] = value;

            // Row Rules
            if (ddbbConfig.show_metadata_modified) {
                modifiedRow[MetadataColumns.MODIFIED] = DateTime.now();
            }

            const pathColumns: string[] =
                ddbbConfig.group_folder_column
                    .split(",")
                    .filter(Boolean);
            // Update the row on disk
            if (isMovingFile && pathColumns.includes(column.key)) {
                const folderPath = destination_folder(view, ddbbConfig);
                const newFilePath = resolveNewFilePath({
                    pathColumns,
                    row: modifiedRow,
                    ddbbConfig,
                    folderPath,
                });
                await FileGroupingService.moveFile(newFilePath, modifiedRow);
                await FileGroupingService.removeEmptyFolders(folderPath, ddbbConfig);
            }

            await EditEngineService.updateRowFileProxy(
                rowTFile,
                column.key,
                value,
                columns,
                ddbbConfig,
                UpdateRowOptions.COLUMN_VALUE
            );

            set((state) => {
                // Save on memory
                return {
                    rows: [
                        ...state.rows.slice(0, rowIndex),
                        modifiedRow,
                        ...state.rows.slice(rowIndex + 1),
                    ]
                };
            })
        };
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}
