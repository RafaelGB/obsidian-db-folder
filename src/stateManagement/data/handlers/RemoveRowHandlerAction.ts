import { RowDataType } from "cdm/FolderModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RemoveRowHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { set, implementation } = tableActionResponse;
        implementation.actions.removeRow = (row: RowDataType) =>
            set((state) => (
                {
                    rows: state.rows.filter(
                        (r) => r.__note__.getFile().path !== row.__note__.getFile().path
                    )
                }
            ));
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}