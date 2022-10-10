import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterColumnIdHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.alterColumnId = async (column: TableColumn, newId: string, nestedIds: string[]) =>
            set((updater) => {
                const labelIndex = updater.columns.findIndex(
                    (col: TableColumn) => (col.key === column.key && col.nestedKey === column.nestedKey)
                );
                const alteredColumns = [...updater.columns];
                alteredColumns[labelIndex].key = newId;
                alteredColumns[labelIndex].accessorKey = newId;
                // Control nested information
                alteredColumns[labelIndex].nestedKey = nestedIds.join('.');
                // Update configuration & row files on disk
                view.diskConfig.updateColumnKey(column.key, newId, column.nestedKey, alteredColumns[labelIndex].nestedKey);
                return { columns: alteredColumns };
            });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}