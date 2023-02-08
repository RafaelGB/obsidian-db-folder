import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class GetFormulaHandlerAction extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { get, implementation } = tableActionResponse;
        implementation.info.getFormula = (formulaName: string) => {
            return get().formula[formulaName];
        };

        implementation.info.getFormulas = () => {
            return get().formula;
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}