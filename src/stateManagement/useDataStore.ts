import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import create from "zustand";
import data_state_actions from "./data/DataStateActions";

const useDataStore = (view: DatabaseView) => {
    return create<DataState>()((set) => {
        const tableActionResponse: TableActionResponse<DataState> = {
            view: view,
            set: set,
            implementation: {
                ...mockDataState(),
                rows: view.rows
            },
        };
        const dataActions = data_state_actions.run(tableActionResponse);
        return dataActions.implementation;
    });
}

function mockDataState(): DataState {
    return {
        rows: [],
        addRow: () => { },
        updateCell: () => { },
        updateDataAfterLabelChange: null,
        removeRow: () => { },
        removeDataOfColumn: () => { },
        parseDataOfColumn: () => { },
    }
}
export default useDataStore;