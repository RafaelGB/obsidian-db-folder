import { TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { InputType } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { EditEngineService } from "services/EditEngineService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class EditOptionForAllRowsHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { get, implementation } = tableActionResponse;
        implementation.actions.editOptionForAllRows = async (column: TableColumn, oldValue: string, newValue: string, columns: TableColumn[],
            ddbbConfig: LocalSettings) => {
            // Lambda to select the rows to update
            let lambdaFilter: (cellValue: Literal) => boolean;
            switch (column.input) {
                case InputType.TAGS:
                    lambdaFilter = (cellValue: Literal) => {
                        const array = Array.isArray(cellValue)
                            ? (cellValue as Literal[])
                            : []
                        return array.length > 0 && array.some(value => value?.toString() === oldValue);
                    }
                    break;
                case InputType.SELECT:
                    lambdaFilter = (cellValue: Literal) => {
                        return (cellValue?.toString().length > 0 && cellValue?.toString() === oldValue);
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
                        return array.map(value => value?.toString() === oldValue ? newValue : value);
                    }
                    break;
                case InputType.SELECT:
                    lambdaUpdate = () => {
                        return newValue;
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
