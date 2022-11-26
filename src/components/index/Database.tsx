import React, { StrictMode } from "react";
import { Table } from "components/Table";
import { TableDataType } from "cdm/FolderModel";
import useTableStore from "components/reducers/TableReducer";
import { c } from "helpers/StylesHelper";
export function createDatabase(tableProps: TableDataType): JSX.Element {
  return <Database {...tableProps} />;
}

export function Database(tableProps: TableDataType) {
  const tableStore = useTableStore(tableProps.view);
  return (
    <StrictMode>
      <Table {...tableProps} tableStore={tableStore} />
    </StrictMode>
  );
}
