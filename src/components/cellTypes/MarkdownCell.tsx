import { CellComponentProps } from "cdm/ComponentsModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import { c } from "helpers/StylesHelper";
import React, { useEffect, useRef } from "react";

const MarkdownCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell, table, row, column } = defaultCell;
  const { tableState } = table.options.meta;
  const markdownRow = tableState.data((state) => state.rows[row.index]);
  const mdRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (mdRef.current !== null) {
      mdRef.current.innerHTML = "";
      const split = markdownRow[column.id].toString().split("|");
      renderMarkdown(
        defaultCell,
        `[[${split[1]}|${split[0]}]]`,
        mdRef.current,
        5
      );
    }
  });
  return (
    <span
      ref={mdRef}
      className={`${c("md_cell")}`}
      key={`markdown_${cell.id}`}
    />
  );
};

export default MarkdownCell;
