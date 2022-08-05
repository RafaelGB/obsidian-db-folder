import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { dbTrim } from "helpers/StylesHelper";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterColumnLabelHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.alterColumnLabel = (column: TableColumn, label: string) =>
            set((updater) => {
                const labelIndex = updater.columns.findIndex(
                    (col: TableColumn) => col.id === column.id
                );
                const newKey = dbTrim(label);
                updater.columns[labelIndex].label = label;
                updater.columns[labelIndex].id = newKey;
                updater.columns[labelIndex].key = newKey;
                updater.columns[labelIndex].accessorKey = newKey;
                // Update configuration & row files on disk
                view.diskConfig.updateColumnKey(column.id, newKey, label);
                return { columns: updater.columns };
            });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}