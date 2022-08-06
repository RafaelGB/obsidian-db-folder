import { TableColumn } from "cdm/FolderModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RemoveDataOfColumnHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { set, implementation } = tableActionResponse;
        implementation.removeDataOfColumn = (column: TableColumn) => set((state) => {
            const newRows = [...state.rows];
            newRows.forEach((row) => {
                delete row[column.id];
            });

            return { rows: newRows };
        });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}