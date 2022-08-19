import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterSortingColumnHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { set, implementation } = tableActionResponse;
        implementation.actions.alterSorting = (column: TableColumn) =>
            set((updater) => {
                const newColumns = [...updater.columns];
                const index = newColumns.findIndex((c) => c.id === column.id);
                newColumns[index].isSorted = column.isSorted;
                newColumns[index].isSortedDesc = column.isSortedDesc;
                return { columns: newColumns };
            });

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);

    }
}