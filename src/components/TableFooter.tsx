import { flexRender } from "@tanstack/react-table";
import { TableFooterProps } from "cdm/FooterModel";
import { MetadataColumns } from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import React from "react";

const COLS_WITHOUT_FOOTER: string[] = [
  MetadataColumns.ROW_CONTEXT_MENU,
  MetadataColumns.ADD_COLUMN,
];

export default function TableFooter(tableFooterProps: TableFooterProps) {
  const { header, headerIndex } = tableFooterProps;
  if (COLS_WITHOUT_FOOTER.contains(header.id)) {
    return (
      <div key={`table-footer-${headerIndex}`} className={c("th footer")} />
    );
  }

  return (
    <div key={`table-footer-${headerIndex}`} className={c("th footer")}>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.footer, header.getContext())}
    </div>
  );
}
