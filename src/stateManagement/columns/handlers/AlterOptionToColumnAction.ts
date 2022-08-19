import { RowSelectOption } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterOptionToColumnHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.addOptionToColumn = (
            column: TableColumn,
            option: string,
            backgroundColor: string
        ) =>
            set((updater) => {
                const optionIndex = updater.columns.findIndex(
                    (col: TableColumn) => col.id === column.id
                );
                const newOption: RowSelectOption = {
                    label: option,
                    backgroundColor: backgroundColor,
                };

                updater.columns[optionIndex].options.push(newOption);
                view.diskConfig.updateColumnProperties(column.id, {
                    options: updater.columns[optionIndex].options,
                });
                return { columns: updater.columns };
            });

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}