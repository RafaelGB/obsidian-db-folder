import { DataState, TableActionResponse, UpdateRowInfo } from "cdm/TableStateInterface";
import { MetadataColumns, UpdateRowOptions } from "helpers/Constants";
import { DateTime } from "luxon";
import { LOGGER } from "services/Logger";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class UpdateCellHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, set, get, implementation } = tableActionResponse;

        implementation.actions.updateCell = async (
            updateRowInfo: UpdateRowInfo) => {
            const { value, rowIndex, column, saveOnDisk = true } = updateRowInfo;
            const modifiedRow = get().rows[rowIndex];
            // Update the row on memory
            modifiedRow[column.key] = value;
            if (saveOnDisk) {
                LOGGER.warn("Saving on disk lab");
                view.history.pushUndo("updateCell");
                await view.dataApi.update({
                    ...updateRowInfo,
                    action: UpdateRowOptions
                        .COLUMN_VALUE
                }, modifiedRow);
            }
            set((state) => {
                // Save on memory
                return {
                    rows: [
                        ...state.rows.slice(0, rowIndex),
                        { ...state.rows[rowIndex], [column.key]: value, [MetadataColumns.MODIFIED]: DateTime.now() },
                        ...state.rows.slice(rowIndex + 1),
                    ]
                };
            })
        };
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}
