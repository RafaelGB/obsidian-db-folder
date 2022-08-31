import { RowDataType, TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { UpdateRowOptions } from "helpers/Constants";
import { dbTrim } from "helpers/StylesHelper";
import { updateRowFileProxy } from "helpers/VaultManagement";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class UpdateDataAfterLabelChangeHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { set, implementation } = tableActionResponse;
        implementation.actions.updateDataAfterLabelChange = async (column: TableColumn, label: string, columns: TableColumn[], ddbbConfig: LocalSettings) => set((state) => {
            const newKey = dbTrim(label);
            // Save on disk
            state.rows.map(async (row: RowDataType) => {
                await updateRowFileProxy(
                    row.__note__.getFile(),
                    column.id,
                    newKey,
                    columns,
                    ddbbConfig,
                    UpdateRowOptions.COLUMN_KEY
                );
            });

            // Save on memory
            console.log(state.rows);
            const alterRows = state.rows.map((row) => {
                row[newKey] = row[column.id];
                delete row[column.id];
                return row;
            });
            console.log(alterRows);
            return { rows: alterRows };
        }
        );
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}