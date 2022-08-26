import { Cell, flexRender } from "@tanstack/react-table";
import { TableCellProps } from "cdm/CellModel";
import { RowDataType } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import { Literal } from "obsidian-dataview";
import React from "react";

export default function TableRow(headerProps: TableCellProps) {
  const { row } = headerProps;

  return (
    <div
      key={`cell-tr-${row.id}`}
      className={`${c(row.getIsSelected() ? " tr-hovered" : "tr")}`}
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
