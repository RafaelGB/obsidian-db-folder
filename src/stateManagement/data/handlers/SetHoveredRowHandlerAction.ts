import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class SetHoveredRowHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { set, implementation } = tableActionResponse;
        implementation.actions.setHoveredRow = async (rowIndex: number) => {
            set((updater) => {
                return { hoveredRow: rowIndex };
            });
        }
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}