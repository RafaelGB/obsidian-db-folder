import React, { StrictMode } from "react";
import { Table } from "components/Table";
import { TableDataType } from "cdm/FolderModel";
import useTableStore from "components/reducers/TableReducer";
import DbErrorBoundary from "components/ErrorComponents";
export function createDatabase(tableProps: TableDataType): JSX.Element {
  return <Database {...tableProps} />;
}

export function Database(tableProps: TableDataType) {
  const tableStore = useTableStore(tableProps.view);
  return (
    <StrictMode>
      {/** TRY CATCH REACT ERROR */}
      <DbErrorBoundary key={"db-error-boundary"}>
        <Table {...tableProps} tableStore={tableStore} />
      </DbErrorBoundary>
    </StrictMode>
  );
}
