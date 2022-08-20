import { Cell, flexRender } from "@tanstack/react-table";
import { TableCellProps } from "cdm/CellModel";
import { RowDataType } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import { Literal } from "obsidian-dataview";
import React from "react";

export default function TableRow(headerProps: TableCellProps) {
  const { row, rowIndex } = headerProps;
  const [rowhovered, setRowhovered] = React.useState(false);
  return (
    <div
      key={`cell-tr-${rowIndex}`}
      className={`${c("tr")}`}
      onMouseEnter={() => {
        console.log(`mouse enter on row ${rowIndex}`);
        setRowhovered(true);
      }}
      onMouseLeave={() => {
        console.log(`mouse leave row ${rowIndex}`);
        setRowhovered(false);
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
