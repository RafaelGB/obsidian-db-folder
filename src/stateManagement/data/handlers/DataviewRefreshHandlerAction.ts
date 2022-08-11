import { FilterSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class DataviewRefreshHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { set, implementation } = tableActionResponse;
        implementation.actions.dataviewRefresh = (filterConfig: FilterSettings) =>
            set((updater) => {
                return {}
            });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}