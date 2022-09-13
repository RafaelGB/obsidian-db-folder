import { TableColumn } from "cdm/FolderModel";
import { FilterSettings, LocalSettings } from "cdm/SettingsModel";
import { AutomationState, DataState, TableActionResponse } from "cdm/TableStateInterface";
import { adapterTFilesToRows } from "helpers/VaultManagement";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class LoadFormulasHandlerAction extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { set, view, implementation } = tableActionResponse;
        implementation.formula = {
            "sum": (row) => {
                return 2;
            }
        };
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}