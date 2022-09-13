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
            },
        };
        const automationActions = automation_state_actions.run(tableActionResponse);
        // return dataActions.implementation;
        return automationActions.implementation;
    });
}

// TODO - find a better way to mock this
function mockAutomationState(): AutomationState {

    return {
        formula: null,
        info: {
            getFormula: null
        }
    }
}
export default useAutomationStore;