import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { dbTrim } from "helpers/StylesHelper";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterColumnLabelHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.alterColumnLabel = async (column: TableColumn, newLabel: string) =>
            set((updater) => {
                const labelIndex = updater.columns.findIndex(
                    (col: TableColumn) => col.id === column.id
                );
                const alteredColumns = [...updater.columns];
                const newKey = dbTrim(newLabel);
                alteredColumns[labelIndex].label = newLabel;
                alteredColumns[labelIndex].id = newKey;
                alteredColumns[labelIndex].key = newKey;
                alteredColumns[labelIndex].accessorKey = newKey;
                // Update configuration & row files on disk
                view.diskConfig.updateColumnKey(column.id, newKey, newLabel);
                console.log(alteredColumns);
                return { columns: alteredColumns };
            });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}