import { Cell, flexRender } from "@tanstack/react-table";
import { TableCellProps } from "cdm/CellModel";
import { RowDataType } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import React from "react";

export default function TableCell(headerProps: TableCellProps) {
  const { row, rowIndex } = headerProps;
  return (
    <div className={`${c("tr")}`} key={`${row.id}-${rowIndex}`}>
      {row
        .getVisibleCells()
        .map((cell: Cell<RowDataType, unknown>, cellIndex: number) => {
          return (
            <div
              key={`${cell.id}-${cellIndex}`}
              className={`${c("td")} data-input`}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          );
        })}
    </div>
  );
}
