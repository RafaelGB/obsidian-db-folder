import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { resolve_tfile } from "helpers/FileManagement";
import DatabaseInfo from "services/DatabaseInfo";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterColumnIdHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.alterColumnId = async (column: TableColumn, newId: string, nestedIds: string[]) => {
            const newNestedIds = nestedIds.join('.');
            // Update on disk
            await view.diskConfig.updateColumnKey(column, newId, nestedIds);

            if (column.config.related_note_path) {
                // Updated related column from disk
                const relatedFile = resolve_tfile(column.config.related_note_path);
                const relatedDB = await new DatabaseInfo(relatedFile, view.plugin.settings.local_settings).build();
                relatedDB.updateColumnKey(column, newId, nestedIds);
            }

            set((updater) => {
                const rootWasUpdated = column.id !== newId;
                const alteredColumns = [...updater.columns];
                // Control if another columns with the same key exists and update them too
                alteredColumns.forEach((col: TableColumn) => {
                    if (col.key === column.key) {
                        if (rootWasUpdated) {
                            col.accessorKey = newId;
                            col.key = newId;
                        }
                        if (col.nestedKey === column.nestedKey) {
                            col.nestedKey = newNestedIds;
                        }
                    }
                });
                // Save on memory
                return { columns: alteredColumns };
            })
        };
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}