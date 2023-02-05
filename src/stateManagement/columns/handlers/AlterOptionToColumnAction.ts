import { ColumnOption } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterOptionToColumnHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, get, implementation } = tableActionResponse;
        implementation.actions.addOptionToColumn = (
            column: TableColumn,
            option: ColumnOption
        ) => {
            const { value } = option;
            // Wrap in a promise of a queue to avoid concurrency issues
            const columnIndex = get().columns.findIndex(
                (col: TableColumn) => col.id === column.id
            );
            const memoryColumn = get().columns[columnIndex];
            // Check if the option already exists
            const optionIndex = memoryColumn.options.findIndex((o) => o.value === value);
            // Add the option to the column if it doesn't exist
            if (optionIndex === -1) {
                memoryColumn.options.push(option);
                // Save on disk
                view.diskConfig.updateColumnProperties(column.id, {
                    options: memoryColumn.options,
                });

                // Save on memory
                set((updater) => {
                    updater.columns[columnIndex] = memoryColumn;
                    return { columns: updater.columns };
                });
            }
        }

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}