import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { Db } from "services/CoreService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class LoadFormulasHandlerAction extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { set, implementation } = tableActionResponse;
        implementation.actions.loadFormulas = async (ddbbConfig) => {
            const formulas = await Db.buildFns(ddbbConfig);
            set({ formula: formulas });
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}