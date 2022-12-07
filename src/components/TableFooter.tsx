import { flexRender } from "@tanstack/react-table";
import { TableFooterProps } from "cdm/FooterModel";
import { c } from "helpers/StylesHelper";
import React from "react";

export default function TableFooter(tableFooterProps: TableFooterProps) {
  const { header, headerIndex } = tableFooterProps;
  return (
    <div key={`table-footer-${headerIndex}`} className={c("th footer")}>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.footer, header.getContext())}
    </div>
  );
}
