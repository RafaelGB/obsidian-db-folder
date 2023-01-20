import { RowDataType, TableColumn } from "cdm/FolderModel";
import { DataState, TableActionResponse, UpdateRowInfo } from "cdm/TableStateInterface";
import { UpdateRowOptions } from "helpers/Constants";
import { EditEngineService } from "services/EditEngineService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RemoveDataOfColumnHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, get, set, implementation } = tableActionResponse;
        implementation.actions.removeDataOfColumn = (updateRowInfo: UpdateRowInfo) => {
            const { column, columns, ddbbConfig } = updateRowInfo;
            if (ddbbConfig.remove_field_when_delete_column) {
                get().rows.map(async (row: RowDataType) => {

                    await view.dataApi.update({
                        ...updateRowInfo,
                        action: UpdateRowOptions
                            .REMOVE_COLUMN
                    }, row);

                    await EditEngineService.updateRowFileProxy(
                        row.__note__.getFile(),
                        column.key,
                        undefined, // delete does not need this field
                        columns,
                        ddbbConfig,
                        UpdateRowOptions.REMOVE_COLUMN
                    );
                });
            }
            set((state) => {
                const newRows = [...state.rows];
                newRows.forEach((row) => {
                    delete row[column.key];
                });

                return { rows: newRows };
            });
        };
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}