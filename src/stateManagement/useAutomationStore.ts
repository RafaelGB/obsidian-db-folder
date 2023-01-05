import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import create from "zustand";
import automation_state_actions from "stateManagement/automations/AutomationStateActions";

const useAutomationStore = (view: DatabaseView) => {
    return create<AutomationState>()((set, get) => {
        const tableActionResponse: TableActionResponse<AutomationState> = {
            view: view,
            set: set,
            get: get,
            implementation: {
                ...mockAutomationState(),
                formula: view.formulas,
            },
        };

        delete view.formulas;
        const automationActions = automation_state_actions.run(tableActionResponse);
        // return dataActions.implementation;
        return automationActions.implementation;
    });
}

function mockAutomationState(): Omit<AutomationState, "formula"> {

    return {
        info: {
            getFormula: null,
            runFormula: null,
            dispatchRollup: null,
            dispatchFooter: null,
        },
        actions: {
            loadFormulas: null,
        }
    }
}
export default useAutomationStore;