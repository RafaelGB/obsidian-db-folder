import { TableActionProps } from "cdm/MenuBarModel";
import React from "react";
import ImportCsvAction from "components/tableActions/ImportCsvAction";
import ExportCsvAction from "components/tableActions/ExportCsvAction";
import SearchBarAction from "components/tableActions/SearchBarAction";
import ShortcutsAction from "components/tableActions/ShortcutsAction";
import AddRowAction from "components/tableActions/AddRowAction";

export default function TableActions(actionProps: TableActionProps) {
  return (
    <>
      <ImportCsvAction {...actionProps} />
      <ExportCsvAction {...actionProps} />
      <SearchBarAction {...actionProps} />
      <AddRowAction {...actionProps} />
      <ShortcutsAction {...actionProps} />
    </>
  );
}
