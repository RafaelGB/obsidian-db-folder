import { TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { Literal } from "obsidian-dataview";
import { ParseService } from "services/ParseService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class ParseDataOfColumnHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { set, implementation } = tableActionResponse;
        implementation.actions.parseDataOfColumn = (column: TableColumn, input: string, ddbbConfig: LocalSettings) =>
            set((updater) => {
                const parsedRows = updater.rows.map((row) => ({
                    ...row,
                    [column.id]: ParseService.parseLiteral(
                        row[column.id] as Literal,
                        input, // Destination type to parse
                        ddbbConfig
                    ),
                }));
                return { rows: parsedRows };
            });

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}