import { Cell, flexRender } from "@tanstack/react-table";
import { TableCellProps } from "cdm/CellModel";
import { RowDataType } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import React from "react";

export default function TableCell(headerProps: TableCellProps) {
  const { row, rowIndex } = headerProps;
  return (
    <div key={`cell-tr-${rowIndex}`} className={`${c("tr")}`}>
      {row
        .getVisibleCells()
        .map((cell: Cell<RowDataType, any>, cellIndex: number) => {
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
