import { Cell, flexRender } from "@tanstack/react-table";
import { TableCellProps } from "cdm/CellModel";
import { RowDataType } from "cdm/FolderModel";
import { StyleVariables } from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import { Literal } from "obsidian-dataview";
import React from "react";

export default function TableRow(headerProps: TableCellProps) {
  const { row, table } = headerProps;
  const { view } = table.options.meta;
  const backgroundColor = view.plugin.settings.global_settings.enable_row_shadow
    ? (table.getRowModel().flatRows.indexOf(row) + 1) % 2
      ? StyleVariables.BACKGROUND_PRIMARY
      : StyleVariables.BACKGROUND_SECONDARY
    : StyleVariables.BACKGROUND_PRIMARY;
  return (
    <div
      key={`cell-tr-${row.id}`}
      className={`${c("tr")}`}
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      {row
        .getVisibleCells()
        .map((cell: Cell<RowDataType, Literal>, cellIndex: number) => {
          return (
            <div
              key={`cell-td-${cell.id}-${cellIndex}`}
              className={`${c(
                "td" + (cellIndex === 0 ? " row-context-menu" : "")
              )} data-input`}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          );
        })}
    </div>
  );
}
