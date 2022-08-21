import { OptionSelect } from "cdm/DatabaseModel";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { randomColor } from "helpers/Colors";
import { InputType } from "helpers/Constants";
import { obtainUniqueOptionValues } from "helpers/SelectHelper";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterColumnTypeHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.alterColumnType = (
            column: TableColumn,
            input: string,
            parsedRows?: RowDataType[]
        ) =>
            set((updater) => {
                const typeIndex = updater.columns.findIndex(
                    (col: TableColumn) => col.id === column.id
                );
                if (updater.columns[typeIndex].input === input) {
                    // If the type is the same, do nothing
                    return {};
                }

                const alteredColumns = [...updater.columns];
                // Save the new type in the disk config
                view.diskConfig.updateColumnProperties(column.id, {
                    input: input,
                });
                alteredColumns[typeIndex].input = input;
                switch (input) {
                    case InputType.SELECT:
                    case InputType.TAGS:
                        const options: OptionSelect[] = [];
                        // Generate selected options
                        parsedRows.forEach((row) => {
                            if (row[column.id]) {
                                options.push({
                                    label: row[column.id]?.toString(),
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
                     */
                }
                return { columns: alteredColumns };
            });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}