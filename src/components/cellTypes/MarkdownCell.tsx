import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { Link } from "obsidian-dataview";
import React, { useEffect, useRef } from "react";
import { MarkdownService } from "services/MarkdownRenderService";

const MarkdownCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell, table, row, column } = defaultCell;
  const tableColumn = column.columnDef as TableColumn;
  const { tableState } = table.options.meta;
  const markdownRow = tableState.data((state) => state.rows[row.index]);
  const configInfo = tableState.configState((state) => state.info);

  const mdRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (mdRef.current !== null) {
      mdRef.current.innerHTML = "";
      MarkdownService.renderMarkdown(
        defaultCell,
        (markdownRow[tableColumn.key] as Link).markdown(),
        mdRef.current,
        5
      );
    }
  });
  return (
    <span
      ref={mdRef}
      className={`${c(
        "md_cell " +
          getAlignmentClassname(
            tableColumn.config,
            configInfo.getLocalSettings(),
            ["tabIndex"]
          )
      )}`}
      key={`markdown_${cell.id}`}
      tabIndex={0}
    />
  );
};

export default MarkdownCell;
