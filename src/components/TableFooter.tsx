import { flexRender } from "@tanstack/react-table";
import { TableFooterProps } from "cdm/FooterModel";
import { c } from "helpers/StylesHelper";
import React from "react";

export default function TableFooter(tableFooterProps: TableFooterProps) {
  const { table, header, headerIndex } = tableFooterProps;
  return (
    <div key={`foot-th-${headerIndex}`} className={c("th footer")}>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.footer, header.getContext())}
    </div>
  );
}
