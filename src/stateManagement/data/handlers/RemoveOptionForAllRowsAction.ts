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
            // Lambda to select the rows to update
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
            // Lambda to update the content of the column of the selected rows
            let lambdaUpdate: (cellValue: Literal) => Literal;
            switch (column.input) {
                case InputType.TAGS:
                    lambdaUpdate = (cellValue: Literal) => {
                        const array = Array.isArray(cellValue)
                            ? (cellValue as Literal[])
                            : []
                        return array.filter(value => value?.toString() !== option);
                    }
                    break;
                case InputType.SELECT:
                    lambdaUpdate = (cellValue: Literal) => {
                        return "";
                    };
                    break;
                default:
                // Do nothing
            }
            // Update the rows batch processing
            EditEngineService.batchUpdateRowFiles(
                lambdaUpdate,
                lambdaFilter,
                get().rows,
                column,
                columns,
                ddbbConfig
            )
        }
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}
