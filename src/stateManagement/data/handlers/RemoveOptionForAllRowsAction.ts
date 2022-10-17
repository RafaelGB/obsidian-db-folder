import { TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { InputType, UpdateRowOptions } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { EditEngineService } from "services/EditEngineService";
import { ParseService } from "services/ParseService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RemoveOptionForAllRowsAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { get, implementation } = tableActionResponse;
        implementation.actions.removeOptionForAllRows = async (column: TableColumn, option: string, columns: TableColumn[],
            ddbbConfig: LocalSettings) => {
            let lambdaFilter: (cellValue: Literal) => boolean;
            switch (column.input) {
                case InputType.TAGS:
                    lambdaFilter = (cellValue: Literal) => {
                        const array = Array.isArray(cellValue)
                            ? (cellValue as Literal[])
                            : []
                        return array.length > 0 && array.some(value => value?.toString() === option);
                    }
                    break;
                case InputType.SELECT:
                    lambdaFilter = (cellValue: Literal) => {
                        return (cellValue?.toString().length > 0 && cellValue?.toString() === option);
                    };
                    break;
                default:
                // Do nothing
            }

            const rowCandidates = get().rows.filter((row) => {
                const cellContent = ParseService.parseRowToCell(
                    row,
                    column,
                    column.input,
                    ddbbConfig
                );
                return lambdaFilter(cellContent);
            });

            rowCandidates.map((row) => {
                const rowTFile = row.__note__.getFile();
                const cellContent = ParseService.parseRowToCell(
                    row,
                    column,
                    column.input,
                    ddbbConfig
                );
                let editedCell: Literal;
                switch (column.input) {
                    case InputType.TAGS:
                        editedCell = Array.isArray(
                            cellContent
                        ) ?
                            (
                                cellContent as Literal[]
                            )
                                .filter(value => value !== option) :
                            [];
                        break;
                    default:
                        editedCell = "";
                }

                const editedRow = ParseService.parseRowToLiteral(
                    row,
                    column,
                    editedCell
                );

                EditEngineService.updateRowFileProxy(
                    rowTFile,
                    column.key,
                    editedRow,
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
