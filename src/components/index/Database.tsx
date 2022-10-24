import React from "react";
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
    <React.StrictMode>
      <div className={c("scroll-container scroll-horizontal")}>
        <Table {...tableProps} tableStore={tableStore} />
      </div>
    </React.StrictMode>
  );
}
