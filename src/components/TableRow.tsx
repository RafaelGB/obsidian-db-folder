import { Cell, flexRender } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { StyleVariables } from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import { Literal } from "obsidian-dataview";
import React from "react";
import { MdFileComponent } from "components/obsidianArq/embedMdInteractive";
import { TableRowProps } from "cdm/RowTypeModel";

export default function TableRow(tableRowProps: TableRowProps) {
  const { row, table } = tableRowProps;
  const { view, tableState } = table.options.meta;
  const backgroundColor = view.plugin.settings.global_settings.enable_row_shadow
    ? (table.getRowModel().flatRows.indexOf(row) + 1) % 2
      ? StyleVariables.BACKGROUND_PRIMARY
      : StyleVariables.BACKGROUND_SECONDARY
    : StyleVariables.BACKGROUND_PRIMARY;

  const fontSize: number = tableState.configState(
    (state) => state.ddbbConfig.font_size
  );
  return (
    <>
      {/** INIT TABLE ROW */}
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
                style={{
                  fontSize: `${fontSize}px`,
                }}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            );
          })}
        {/** ENDS TABLE ROW */}
      </div>
      {/** INIT MD FILE COMPONENT
       * TODO - div table-cell style does not support colSpan. Any other way to do this?
       * provoking a Warning: validateDOMNesting(...)
       */}
      {row.getIsExpanded() && (
        <tr key={`expanded-cell-tr-${row.id}`}>
          <td
            colSpan={row.getVisibleCells().length}
            className={c("row-extend-decorator")}
            key={`expanded-cell-td-${row.id}`}
          >
            <MdFileComponent
              row={row}
              view={view}
              key={`expanded-file-component-${row.id}`}
            />
          </td>
          {/** EDNS MD FILE COMPONENT */}
        </tr>
      )}
    </>
  );
}
