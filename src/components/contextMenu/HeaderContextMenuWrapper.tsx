import { flexRender, Header } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import React from "react";

export default function HeaderContextMenuWrapper(
  header: Header<RowDataType, unknown>
) {
  console.log("HeaderContextMenuWrapper");
  return (
    <div key={`${header.id}`} className={`${c("th")}`}>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </div>
  );
}
