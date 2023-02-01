import { AutomationState, AutomationStateActions, AutomationStateInfo, TableActionResponse } from "cdm/TableStateInterface";
import { create } from "zustand";
import automation_state_actions from "stateManagement/automations/AutomationStateActions";
import { CustomView } from "views/AbstractView";

const useAutomationStore = (view: CustomView) => {
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
    const mockActions: AutomationStateActions = {
        loadFormulas: null,
    }

    const mockInfo: AutomationStateInfo = {
        getFormula: null,
        runFormula: null,
        dispatchRollup: null,
        dispatchFooter: null,
    }

    return {
        actions: mockActions,
        info: mockInfo,
    }
}
export default useAutomationStore;