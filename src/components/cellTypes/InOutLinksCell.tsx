import { CellComponentProps } from "cdm/ComponentsModel";
import { c } from "helpers/StylesHelper";
import { Link } from "obsidian-dataview";
import React, { useEffect, useRef } from "react";
import { MarkdownService } from "services/MarkdownRenderService";

const InOutLinksCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { table, row, column } = defaultCell;
  const { tableState } = table.options.meta;
  const markdownRow = tableState.data((state) => state.rows[row.index]);
  const mdRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (mdRef.current === null) return;

    const links = markdownRow[column.id] as Link[];
    const markdownLinks: string[] = [];
    links.forEach((link) => {
      markdownLinks.push(`- ${link.markdown()}`);
    });
    MarkdownService.renderMarkdown(
      defaultCell,
      markdownLinks.join("\n"),
      mdRef.current,
      5
    );
  });
  return (
    <span
      ref={mdRef}
      className={c("md_cell text-align-left tabIndex")}
      tabIndex={0}
    />
  );
};

export default InOutLinksCell;
