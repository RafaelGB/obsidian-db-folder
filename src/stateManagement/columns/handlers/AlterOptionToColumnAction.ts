import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterOptionToColumnHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, get, implementation } = tableActionResponse;
        implementation.actions.addOptionToColumn = (
            column: TableColumn,
            option: string,
            backgroundColor: string
        ) => {
            // Wrap in a promise of a queue to avoid concurrency issues
            const columnIndex = get().columns.findIndex(
                (col: TableColumn) => col.id === column.id
            );
            const memoryColumn = get().columns[columnIndex];
            // Check if the option already exists
            const optionIndex = memoryColumn.options.findIndex((o) => o.label === option);
            // Add the option to the column if it doesn't exist
            if (optionIndex === -1) {
                // Save on disk
                const newOptions = [...memoryColumn.options, { label: option, backgroundColor: backgroundColor }];
                view.diskConfig.updateColumnProperties(column.id, {
                    options: newOptions,
                });

                // Save on memory
                set((updater) => {
                    memoryColumn.options = newOptions;
                    updater.columns[columnIndex] = memoryColumn;
                    return { columns: updater.columns };
                });
            }
        }

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}