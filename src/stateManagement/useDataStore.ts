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
                ...emptyDataState(),
                rows: view.rows
            },
        };
        const dataActions = data_state_actions.run(tableActionResponse);
        return dataActions.implementation;
    });
}

function emptyDataState(): Omit<DataState, "rows"> {
    return {
        actions: {
            addRow: null,
            updateCell: null,
            updateDataAfterLabelChange: null,
            removeRow: null,
            editOptionForAllRows: null,
            removeDataOfColumn: null,
            removeOptionForAllRows: null,
            parseDataOfColumn: null,
            dataviewRefresh: null,
            renameFile: null,
            saveDataFromFile: null,
            groupFiles: null,
        },
    }
}
export default useDataStore;
