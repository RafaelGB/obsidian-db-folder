import { TableActionProps } from "cdm/MenuBarModel";
import React from "react";
import ImportCsvAction from "components/tableActions/ImportCsvAction";

export default function TableActions(actionProps: TableActionProps) {
  return (
    <>
      <ImportCsvAction {...actionProps} />
    </>
  );
}
