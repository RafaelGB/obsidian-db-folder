import { RowDataType } from "cdm/FolderModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { VaultManagerDB } from "services/FileManagerService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class BulkRowUpdateHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { get, set, implementation } = tableActionResponse;
        implementation.actions.bulkRowUpdate = async (alteredRows: RowDataType[], action: string) => {
            let updatedRows: RowDataType[] = get().rows;
            switch (action) {
                case "remove":
                    updatedRows = await this.removeRows(get(), alteredRows);
                    break;
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
    private async removeRows(state: DataState, rowsToDelete: RowDataType[]): Promise<RowDataType[]> {
        const filePathToFilter = rowsToDelete.map((row) => row.__note__.filepath);
        rowsToDelete.forEach(async (row) => {
            await VaultManagerDB.removeNote(row.__note__.getFile());
        });
        return state.rows.filter((row) => !filePathToFilter.includes(row.__note__.filepath));
    }
}