import { DataState, TableActionResponse, UpdateRowInfo } from "cdm/TableStateInterface";
import { MetadataColumns } from "helpers/Constants";
import { DateTime } from "luxon";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class UpdateCellHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, set, get, implementation } = tableActionResponse;
        implementation.actions.updateCell = async (
            updateRowInfo: UpdateRowInfo) => {
            const { value, rowIndex, column } = updateRowInfo;
            const modifiedRow = get().rows[rowIndex];
            // Update the row on memory
            modifiedRow[column.key] = value;
            await view.dataApi.update(updateRowInfo, modifiedRow);

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
