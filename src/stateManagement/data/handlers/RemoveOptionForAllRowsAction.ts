import { TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { InputType, UpdateRowOptions } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { EditEngineService } from "services/EditEngineService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RemoveOptionForAllRowsAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { get, implementation } = tableActionResponse;
        implementation.actions.removeOptionForAllRows = async (column: TableColumn, option: string, columns: TableColumn[],
            ddbbConfig: LocalSettings) => {
            let lambdaFilter = (cellValue: Literal) => {
                return (cellValue?.toString().length > 0 && cellValue?.toString() === option);
            };
            switch (column.input) {
                case InputType.TAGS:
                    lambdaFilter = (cellValue: Literal) => {
                        const array = Array.isArray(cellValue)
                            ? (cellValue as Literal[])
                            : []
                        return array.length > 0 && array.some(value => value?.toString() === option);
                    }
                    break;
                default:
                // Do nothing
            }
            const rowCandidates = get().rows.filter((row) => {
                return lambdaFilter(row[column.key] as Literal);
            });
            rowCandidates.map((row) => {
                const rowTFile = row.__note__.getFile();
                switch (column.input) {
                    case InputType.TAGS:
                        row[column.key] = Array.isArray(
                            row[column.key] as Literal
                        ) ?
                            (
                                row[column.key] as Literal[]
                            )
                                .filter(value => value !== option) :
                            [];
                        break;
                    default:
                        row[column.key] = "";
                }
                EditEngineService.updateRowFileProxy(
                    rowTFile,
                    column.key,
                    row[column.key] as Literal,
                    columns,
                    ddbbConfig,
                    UpdateRowOptions.COLUMN_VALUE
                );
            });
        }
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}
