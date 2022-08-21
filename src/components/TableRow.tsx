import { Cell, flexRender } from "@tanstack/react-table";
import { TableCellProps } from "cdm/CellModel";
import { RowDataType } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import { Literal } from "obsidian-dataview";
import React from "react";

export default function TableRow(headerProps: TableCellProps) {
  const { row, rowIndex, tableStore } = headerProps;
  const [hoveredRow, rowActions] = tableStore.data((state) => [
    state.hoveredRow,
    state.actions,
  ]);
  return (
    <div
      key={`cell-tr-${rowIndex}`}
      className={`${c("tr" + (row.getIsSelected() ? " hovered-row" : ""))}`}
      onMouseEnter={() => {
        rowActions.setHoveredRow(rowIndex);
      }}
    >
      {row
        .getVisibleCells()
        .map((cell: Cell<RowDataType, Literal>, cellIndex: number) => {
          return (
            <div
              key={`cell-td-${cell.id}-${cellIndex}`}
              className={`${c("td")} data-input`}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          );
        })}
    </div>
  );
}
