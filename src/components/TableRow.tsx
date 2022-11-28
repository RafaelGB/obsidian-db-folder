import { Cell, flexRender, Row, Table } from "@tanstack/react-table";
import { TableCellProps } from "cdm/CellModel";
import { RowDataType } from "cdm/FolderModel";
import { StyleVariables } from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import { Literal } from "obsidian-dataview";
import React, { useEffect, useRef } from "react";
import { VaultManagerDB } from "services/FileManagerService";
import { MarkdownService } from "services/MarkdownRenderService";

export default function TableRow(headerProps: TableCellProps) {
  const { row, table } = headerProps;
  const { view } = table.options.meta;
  const backgroundColor = view.plugin.settings.global_settings.enable_row_shadow
    ? (table.getRowModel().flatRows.indexOf(row) + 1) % 2
      ? StyleVariables.BACKGROUND_PRIMARY
      : StyleVariables.BACKGROUND_SECONDARY
    : StyleVariables.BACKGROUND_PRIMARY;

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
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            );
          })}
        {/** ENDS TABLE ROW */}
      </div>
      {/** INIT MD FILE COMPONENT */}
      {row.getIsExpanded() && (
        <tr key={`expanded-cell-tr-${row.id}`}>
          <td
            colSpan={row.getVisibleCells().length}
            className={c("row-extend-decorator")}
          >
            <MdFileComponent row={row} table={table} />
          </td>
          {/** EDNS MD FILE COMPONENT */}
        </tr>
      )}
    </>
  );
}

const MdFileComponent = ({
  row,
  table,
}: {
  row: Row<RowDataType>;
  table: Table<RowDataType>;
}) => {
  const containerCellRef = useRef<HTMLDivElement>();

  useEffect(() => {
    const effectCallback = async () => {
      const content = await VaultManagerDB.obtainContentFromTfile(
        row.original.__note__.getFile()
      );
      MarkdownService.renderStringAsMarkdown(
        table,
        content,
        containerCellRef.current,
        5
      );
    };

    effectCallback();
  }, []);

  return <span ref={containerCellRef} key={`expanded-md-file-${row.index}`} />;
};
