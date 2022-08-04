import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class DeleteColumnHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.remove = (column: TableColumn) =>
            set((updater) => {
                view.diskConfig.removeColumn(column.id);
                const filtered = updater.columns.filter((c) => c.id !== column.id);
                return { columns: filtered };
            });

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}