import { RowDataType } from "cdm/FolderModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { Notice } from "obsidian";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RemoveRowHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.removeRow = async (rowToRemove: RowDataType) => {
            try {
                await view.dataApi.delete(rowToRemove);
                set((state) => {
                    const filteredRows = state.rows.filter(
                        (r) => r.__note__.filepath !== rowToRemove.__note__.filepath
                    );
                    return {
                        rows: filteredRows
                    }
                })
            } catch (error) {
                new Notice(`Error: Could not remove note from database. path does not exist: ${rowToRemove.__note__.filepath}`);
            }

        };
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);

    }
}