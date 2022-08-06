import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterColumnSizeHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.alterColumnSize = (id: string, width: number) =>
            set((updater) => {
                view.diskConfig.updateColumnProperties(id, {
                    width: width,
                });
                const index = implementation.columns.findIndex((column) => column.id === id);
                updater.columns[index].width = width;
                // DO NOT rerender the columns this way
                return { columns: updater.columns };
            });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}
