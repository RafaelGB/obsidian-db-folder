import { TableColumn } from "cdm/FolderModel";
import { FilterSettings, LocalSettings } from "cdm/SettingsModel";
import { AutomationState, DataState, TableActionResponse } from "cdm/TableStateInterface";
import { adapterTFilesToRows } from "helpers/VaultManagement";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class GetFormulaHandlerAction extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { get, view, implementation } = tableActionResponse;
        implementation.info.getFormula = (formulaName: string) => {
            return get().formula[formulaName];
        };
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}