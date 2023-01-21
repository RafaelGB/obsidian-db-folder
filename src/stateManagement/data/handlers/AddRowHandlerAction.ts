import { CreateRowInfo, DataState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AddRowlHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.addRow = async ({ filename, columns, ddbbConfig }: CreateRowInfo) => {
            const row = await view.dataApi.create(filename, columns, ddbbConfig);
            set((state) => {
                return { rows: [...state.rows, row] }
            })
        };
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}
