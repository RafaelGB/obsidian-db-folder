import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterColumnIdHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.alterColumnId = async (column: TableColumn, newId: string, nestedIds: string[]) =>
            set((updater) => {
                const labelIndex = updater.columns.findIndex(
                    (col: TableColumn) => col.id === column.id
                );
                const alteredColumns = [...updater.columns];
                alteredColumns[labelIndex].id = newId;
                alteredColumns[labelIndex].key = newId;
                alteredColumns[labelIndex].accessorKey = newId;
                // Control nested information
                alteredColumns[labelIndex].nestedId = nestedIds.join('.');
                // Update configuration & row files on disk
                view.diskConfig.updateColumnKey(column.id, newId, alteredColumns[labelIndex].nestedId);
                return { columns: alteredColumns };
            });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}