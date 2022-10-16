import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterOptionToColumnHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.addOptionToColumn = async (
            column: TableColumn,
            option: string,
            backgroundColor: string
        ) => {
            // Save on disk
            const newOptions = [...column.options, { label: option, backgroundColor: backgroundColor }];
            await view.diskConfig.updateColumnProperties(column.id, {
                options: newOptions,
            });
            // Save on memory
            set((updater) => {
                const optionIndex = updater.columns.findIndex(
                    (col: TableColumn) => col.id === column.id
                );
                updater.columns[optionIndex].options = newOptions;
                return { columns: updater.columns };
            });
        }

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}