import { RowDataType } from "cdm/FolderModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { Notice } from "obsidian";
import { VaultManagerDB } from "services/FileManagerService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RemoveRowHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { set, implementation } = tableActionResponse;
        implementation.actions.removeRow = (rowToRemove: RowDataType) =>
            set((state) => {
                const filteredRows = state.rows.filter(
                    (r) => r.__note__.filepath !== rowToRemove.__note__.filepath
                );
                if (filteredRows.length !== state.rows.length) {
                    VaultManagerDB.removeNote(rowToRemove.__note__.getFile());
                } else {
                    new Notice(`Error: Could not remove note from database. path does not exist: ${rowToRemove.__note__.filepath}`);
                }
                return {
                    rows: filteredRows
                }
            });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}