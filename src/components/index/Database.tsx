import React, { useEffect, useReducer } from "react";
import { Table } from "components/Table";
import { TableDataType } from "cdm/FolderModel";
import { databaseReducer } from "components/reducers/DatabaseDispatch";
import { ActionTypes } from "helpers/Constants";
import useTableStore from "components/reducers/TableReducer";
export function createDatabase(tableProps: TableDataType): JSX.Element {
  return <Database {...tableProps} />;
}

export function Database(tableProps: TableDataType) {
  const tableStore = useTableStore(tableProps.view);
  return (
    <>
      <Table {...tableProps} tableStore={tableStore} />
      <div id="popper-container" key={"popper-container-key"}></div>
    </>
  );
}
