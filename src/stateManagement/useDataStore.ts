import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import create from "zustand";
import data_state_actions from "stateManagement/data/DataStateActions";

const useDataStore = (view: DatabaseView) => {
    return create<DataState>()((set, get) => {
        const tableActionResponse: TableActionResponse<DataState> = {
            view: view,
            set: set,
            get: get,
            implementation: {
                ...mockDataState(),
                rows: view.rows
            },
        };
        const dataActions = data_state_actions.run(tableActionResponse);
        return dataActions.implementation;
    });
}

// TODO - find a better way to mock this
function mockDataState(): DataState {

    return {
        rows: [],
        actions: {
            addRow: null,
            updateCell: null,
            updateDataAfterLabelChange: null,
            removeRow: null,
            removeDataOfColumn: null,
            removeOptionForAllRows: null,
            parseDataOfColumn: null,
            dataviewRefresh: null,
            renameFile: null,
            saveDataFromFile: null
        },
    }
}
export default useDataStore;