import { FilterSettings } from "@features/filters/model/FiltersModel";
import { TableColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { adapterTFilesToRows } from "helpers/VaultManagement";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class DataviewRefreshHandlerAction extends AbstractTableAction<DataState> {
    handle(tableActionResponse: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { set, view, implementation } = tableActionResponse;
        implementation.actions.dataviewRefresh = async (column: TableColumn[], ddbbConfig: LocalSettings, filterConfig: FilterSettings) => {
            const refreshedRows = await adapterTFilesToRows(
                view.file,
                column,
                ddbbConfig,
                filterConfig
            );
            set(() => {
                return { rows: [...refreshedRows] };
            });
        }
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}