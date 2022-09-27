import { TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { MetadataColumns, UpdateRowOptions } from "helpers/Constants";
import { moveFile } from "helpers/VaultManagement";
import { Literal } from "obsidian-dataview";
import { DateTime } from "luxon";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";
import { destination_folder } from "helpers/FileManagement";
import { EditEngineService } from "services/EditEngineService";

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
            const emptyPathColumn = pathColumns.some((columnName) => !modifiedRow[columnName]);
            // Update the row on disk
            if ( isMovingFile && pathColumns.includes(column.id) && !emptyPathColumn) {
                const subfolders = pathColumns .map((name) => modifiedRow[name]) .join("/");
                const moveInfo = {
                    file: rowTFile,
                    id: column.id,
                    value: value,
                    columns: columns,
                    ddbbConfig: ddbbConfig,
                }
                const foldePath = destination_folder(view, ddbbConfig);
                await moveFile(`${foldePath}/${subfolders}`, moveInfo);
                // Update row file
                modifiedRow[
                    MetadataColumns.FILE
                ] = `${rowTFile.basename}|${foldePath}/${subfolders}/${rowTFile.name}`;
                // Check if action.value is a valid folder name
                const auxPath =
                    subfolders !== ""
                        ? `${foldePath}/${subfolders}/${rowTFile.name}`
                        : `${foldePath}/${rowTFile.name}`;

                const recordRow: Record<string, Literal> = {};
                Object.entries(modifiedRow).forEach(([key, value]) => {
                    recordRow[key] = value as Literal;
                });

                modifiedRow.__note__.filepath = auxPath;
            } else {
                // Save on disk
                await EditEngineService.updateRowFileProxy(
                    rowTFile,
                    column.id,
                    value,
                    columns,
                    ddbbConfig,
                    UpdateRowOptions.COLUMN_VALUE
                );
            }
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
