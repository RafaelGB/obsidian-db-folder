import { obtainFormulasFromFolder } from "automations/AutomationsHelper";
import { FormulaGenerator } from "automations/FormulaGenerator";
import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class LoadFormulasHandlerAction extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { set, view, implementation } = tableActionResponse;
        implementation.actions.loadFormulas = async (ddbbConfig) => {
            const formulas = await obtainFormulasFromFolder(ddbbConfig);
            set({ formula: formulas });
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}