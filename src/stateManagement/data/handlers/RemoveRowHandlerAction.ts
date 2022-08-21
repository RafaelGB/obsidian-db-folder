import { RowDataType } from "cdm/FolderModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { VaultManagerDB } from "services/FileManagerService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RemoveRowHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { set, implementation } = tableActionResponse;
        implementation.actions.removeRow = (rowToRemove: RowDataType) =>
            set((state) => {
                const filteredRows = state.rows.filter(
                    (r) => r.__note__.getFile().path !== rowToRemove.__note__.getFile().path
                );
                VaultManagerDB.removeNote(rowToRemove.__note__.getFile());
                return {
                    rows: filteredRows
                }
            });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}