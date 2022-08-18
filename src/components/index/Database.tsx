import React from "react";
import { Table } from "components/Table";
import { TableDataType } from "cdm/FolderModel";
import useTableStore from "components/reducers/TableReducer";
export function createDatabase(tableProps: TableDataType): JSX.Element {
  return <Database {...tableProps} />;
}

export function Database(tableProps: TableDataType) {
  const tableStore = useTableStore(tableProps.view);
  return (
    <React.StrictMode>
      <Table {...tableProps} tableStore={tableStore} />
      <div id="popper-container" key={"popper-container-key"}></div>
    </React.StrictMode>
  );
}
