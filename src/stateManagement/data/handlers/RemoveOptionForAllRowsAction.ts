import { TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { InputType, UpdateRowOptions } from "helpers/Constants";
import { updateRowFileProxy } from "helpers/VaultManagement";
import { Literal } from "obsidian-dataview";
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
                return lambdaFilter(row[column.id] as Literal);
            });
            rowCandidates.map((row) => {
                const rowTFile = row.__note__.getFile();
                switch (column.input) {
                    case InputType.TAGS:
                        row[column.id] = Array.isArray(
                            row[column.id] as Literal
                        ) ?
                            (
                                row[column.id] as Literal[]
                            )
                                .filter(value => value !== option) :
                            [];
                        break;
                    default:
                        row[column.id] = "";
                }
                updateRowFileProxy(
                    rowTFile,
                    column.id,
                    row[column.id] as Literal,
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
