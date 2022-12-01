import Footer from "automations/Footer";
import { DatabaseHeaderProps, TableColumn } from "cdm/FolderModel";
import { InputType } from "helpers/Constants";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import React from "react";

export default function DefaultFooter(headerProps: DatabaseHeaderProps) {
  /** Properties of footer */
  const { header, table } = headerProps;
  const { tableState } = table.options.meta;
  const configInfo = tableState.configState((state) => state.info);
  /** Column values */
  const { input, config } = header.column.columnDef as TableColumn;
  let footerInfo: string;
  switch (input) {
    case InputType.NUMBER:
      footerInfo = new Footer(table.getRowModel().rows).sum(header.id);
      break;
    default:
      return null;
    // Do nothing
  }

  return (
    <span
      key={`foot-th-cell-${header.id}`}
      className={c(
        getAlignmentClassname(config, configInfo.getLocalSettings())
      )}
    >
      {footerInfo}
    </span>
  );
}
