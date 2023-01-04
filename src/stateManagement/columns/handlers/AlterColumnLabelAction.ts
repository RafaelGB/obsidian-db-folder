import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterColumnLabelHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.alterColumnLabel = async (column: TableColumn, newLabel: string) =>
            set((updater) => {
                const labelIndex = updater.columns.findIndex(
                    (col: TableColumn) => col.id === column.id
                );

                // Update configuration & row files on disk
                view.diskConfig.updateColumnProperties(column.id, {
                    label: newLabel
                });
                // Update state on memory
                const alteredColumn = updater.columns[labelIndex];
                alteredColumn.label = newLabel;
                return { columns: [...updater.columns] };
            });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}