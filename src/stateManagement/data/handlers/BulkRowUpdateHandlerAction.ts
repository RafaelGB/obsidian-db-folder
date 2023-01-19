import { RowDataType, TableColumn } from "cdm/FolderModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { VaultManagerDB } from "services/FileManagerService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";
import { CustomView } from "views/AbstractView";

export default class BulkRowUpdateHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { view, get, set, implementation } = tableActionResponse;
        implementation.actions.bulkRowUpdate = async (alteredRows: RowDataType[], columns: TableColumn[], action: string) => {
            let updatedRows: RowDataType[] = get().rows;
            switch (action) {
                case "remove":
                    updatedRows = await this.removeRows(get(), alteredRows, view);
                    break;
                case "duplicate":
                    updatedRows = await this.duplicateRows(get(), alteredRows);
                default:
                // Do nothing
            }
            set(() => {
                return {
                    rows: updatedRows
                }
            });
        }
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);

    }
    /**
     * Delete the rows from the database and remove them from the state
     * @param state 
     * @param rowsToDelete 
     * @returns 
     */
    private async removeRows(state: DataState, rowsToDelete: RowDataType[], view: CustomView): Promise<RowDataType[]> {
        const filePathToFilter = rowsToDelete.map((row) => row.__note__.filepath);
        rowsToDelete.forEach(async (row) => {
            view.dataApi.delete(row);
        });
        return state.rows.filter((row) => !filePathToFilter.includes(row.__note__.filepath));
    }

    /**
     * Duplicate the rows from the database and insert them into the state
     * @param state 
     * @param rowsToDuplicate 
     * @returns 
     */
    private duplicateRows(state: DataState, rowsToDuplicate: RowDataType[]) {
        cancelAnimationFrame
        rowsToDuplicate.forEach(async (row) => {
            await VaultManagerDB.duplicateNote(row.__note__.getFile());
        })
        return state.rows;
    }
}