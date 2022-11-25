import { TableActionProps } from "cdm/MenuBarModel";
import React from "react";
import ImportCsvAction from "components/tableActions/ImportCsvAction";
import ExportCsvAction from "components/tableActions/ExportCsvAction";
import SearchBarAction from "components/tableActions/SearchBarAction";

export default function TableActions(actionProps: TableActionProps) {
  return (
    <>
      <ImportCsvAction {...actionProps} />
      <ExportCsvAction {...actionProps} />
      <SearchBarAction {...actionProps} />
    </>
  );
}
