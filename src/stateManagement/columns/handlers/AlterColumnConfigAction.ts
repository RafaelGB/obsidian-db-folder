import { ConfigColumn, TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterColumnConfigAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, get, implementation } = tableActionResponse;
        implementation.actions.alterColumnConfig = (column: TableColumn, config: Partial<ConfigColumn>) => {
            // Wrap in a promise of a queue to avoid concurrency issues
            const columnIndex = get().columns.findIndex(
                (col: TableColumn) => col.id === column.id
            );

            set((updater) => {
                const alterColumn = updater.columns[columnIndex];
                // Update on disk
                view.diskConfig.updateColumnConfig(column.id, config);
                // Update on memory
                return {
                    columns: [
                        ...updater.columns.slice(0, columnIndex),
                        alterColumn,
                        ...updater.columns.slice(columnIndex + 1)
                    ]
                };
            });
        }

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}