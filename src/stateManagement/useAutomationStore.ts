import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import create from "zustand";

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
        // const dataActions = data_state_actions.run(tableActionResponse);
        // return dataActions.implementation;
        return tableActionResponse.implementation;
    });
}

// TODO - find a better way to mock this
function mockAutomationState(): AutomationState {

    return {
        formula: null
    }
}
export default useAutomationStore;