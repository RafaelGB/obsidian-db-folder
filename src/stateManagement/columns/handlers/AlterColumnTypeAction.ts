import { OptionSelect } from "cdm/DatabaseModel";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { randomColor } from "helpers/Colors";
import { InputType } from "helpers/Constants";
import { obtainUniqueOptionValues } from "helpers/SelectHelper";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterColumnTypeHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, get, set, implementation } = tableActionResponse;
        implementation.actions.alterColumnType = async (
            column: TableColumn,
            targetInput: string,
            parsedRows?: RowDataType[]
        ) => {
            const typeIndex = get().columns.findIndex(
                (col: TableColumn) => col.id === column.id
            );
            // Alter column type just in case it is not the same
            if (get().columns[typeIndex].input !== targetInput) {
                // Save the new type in the disk config
                await view.diskConfig.updateColumnProperties(column.id, {
                    input: targetInput,
                });
                set((updater) => {

                    const alteredColumns = [...updater.columns];
                    alteredColumns[typeIndex].input = targetInput;
                    switch (targetInput) {
                        case InputType.SELECT:
                        case InputType.TAGS:
                            const options: OptionSelect[] = [];
                            // Generate selected options
                            parsedRows.forEach((row) => {
                                if (row[column.key]) {
                                    options.push({
                                        label: row[column.key]?.toString(),
                                        backgroundColor: randomColor(),
                                    });
                                }
                            });
                            alteredColumns[typeIndex].options =
                                obtainUniqueOptionValues(options);
                            break;
                        default:
                        /**
                         * GENERIC COLUMN TYPE Doesn't have options
                         * Aplied to:
                         * - TEXT
                         * - NUMBER
                         * - CALENDAR
                         * - CALENDAR_TIME
                         * - CHECKBOX
                         * - FORMULA
                         */
                    }
                    return { columns: alteredColumns };
                });
            }
        };
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);

    }
}