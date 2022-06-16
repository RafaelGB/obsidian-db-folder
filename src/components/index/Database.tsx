import React, { useEffect, useReducer } from "react";
import { Table } from "components/Table";
import { TableDataType } from "cdm/FolderModel";
import { databaseReducer } from "components/reducers/DatabaseDispatch";
import { ActionTypes } from "helpers/Constants";
export function createDatabase(tableProps: TableDataType): JSX.Element {
  return <Database {...tableProps} />;
}

export function Database(tableProps: TableDataType) {
  const [state, dataDispatch] = useReducer(databaseReducer, tableProps);

  useEffect(() => {
    dataDispatch({ type: ActionTypes.ENABLE_RESET });
  }, [state.view.row, state.columns]);

  return (
    <>
      <Table {...state} dispatch={dataDispatch} />
      <div id="popper-container"></div>
    </>
  );
}
