import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterIsHiddenColumnHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { set, implementation } = tableActionResponse;
        implementation.actions.alterIsHidden = (column: TableColumn, isHidden: boolean) =>
            set((updater) => {
                const newColumns = [...updater.columns];
                const index = newColumns.findIndex((c) => c.id === column.id);
                newColumns[index].isHidden = isHidden;
                return { columns: newColumns };
            });

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);

    }
}