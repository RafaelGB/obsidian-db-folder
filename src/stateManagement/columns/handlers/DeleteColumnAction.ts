import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { resolve_tfile } from "helpers/FileManagement";
import DatabaseInfo from "services/DatabaseInfo";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class DeleteColumnHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.remove = async (column: TableColumn) => {
            // Remove column from disk
            view.diskConfig.removeColumn(column.id);
            if (column.config.related_note_path) {
                // Remove related column from disk
                const relatedFile = resolve_tfile(column.config.related_note_path);
                const relatedDB = await new DatabaseInfo(relatedFile, view.plugin.settings.local_settings).build();
                relatedDB.removeColumn(column.id);
            }

            set((updater) => {
                // Remove column from state
                const filtered = updater.columns.filter((c) => c.id !== column.id);
                return { columns: filtered };
            });
        }

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}