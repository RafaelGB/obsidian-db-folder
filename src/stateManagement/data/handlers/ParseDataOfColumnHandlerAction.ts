import { TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { ParseService } from "services/ParseService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class ParseDataOfColumnHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { set, implementation } = tableActionResponse;
        implementation.actions.parseDataOfColumn = (column: TableColumn, input: string, ddbbConfig: LocalSettings) =>
            set((updater) => {
                const parsedRows = updater.rows.map((row) => {
                    // Transform the input into the target type
                    const parsedValue = ParseService.parseRowToCell(
                        row,
                        column,
                        input,
                        ddbbConfig
                    );
                    // Construct the new cell with the changed value
                    const newCell = ParseService.parseRowToLiteral(
                        row,
                        column,
                        parsedValue
                    );
                    // return the new row
                    return {
                        ...row,
                        [column.key]: newCell,
                    }
                });
                return { rows: parsedRows };
            });

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}