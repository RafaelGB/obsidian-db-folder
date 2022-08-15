import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterIsHiddenColumnHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { set, implementation, view } = tableActionResponse;
        implementation.actions.alterIsHidden = (column: TableColumn, isHidden: boolean) =>
            set((updater) => {
                // Update on disk
                view.diskConfig.updateColumnProperties(column.id, { isHidden: isHidden });
                // Update in memory (without reloading components)
                updater.columns = updater.columns.map((c) => {
                    if (c.id === column.id) {
                        c.isHidden = isHidden;
                    }
                    return c;
                });
                return { columns: updater.columns };
            });

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);

    }
}