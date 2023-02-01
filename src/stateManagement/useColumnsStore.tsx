import {
  ColumnsState,
  ColumnsStateActions,
  ColumnsStateInfo,
  TableActionResponse,
} from "cdm/TableStateInterface";
import { create } from "zustand";
import column_state_actions from "stateManagement/columns/ColumnsStateActions";
import { CustomView } from "views/AbstractView";

const useColumnsStore = (view: CustomView) => {
  return create<ColumnsState>()((set, get) => {
    const tableActionResponse: TableActionResponse<ColumnsState> = {
      view: view,
      set: set,
      get: get,
      implementation: {
        ...emptyColumnsState(),
        columns: view.columns,
        shadowColumns: view.shadowColumns,
      },
    };

    const columnActions = column_state_actions.run(tableActionResponse);
    return columnActions.implementation;
  });
};

function emptyColumnsState(): Omit<ColumnsState, "columns" | "shadowColumns"> {
  const mockActions: ColumnsStateActions = {
    addToLeft: null,
    addToRight: null,
    remove: null,
    alterSorting: null,
    addOptionToColumn: null,
    alterColumnType: null,
    alterColumnId: null,
    alterColumnLabel: null,
    alterColumnSize: null,
    alterIsHidden: null,
    alterColumnConfig: null,
  };

  const mockInfo: ColumnsStateInfo = {
    getValueOfAllColumnsAsociatedWith: null,
    getVisibilityRecord: null,
    getAllColumns: null,
    getColumnOptions: null,
  };
  return {
    actions: mockActions,
    info: mockInfo,
  };
}

export default useColumnsStore;
