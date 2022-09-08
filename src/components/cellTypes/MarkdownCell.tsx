import { CellComponentProps } from "cdm/ComponentsModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import { c } from "helpers/StylesHelper";
import { Link } from "obsidian-dataview";
import React, { useEffect, useRef } from "react";

const MarkdownCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell } = defaultCell;
  const cellValue = cell.getValue() as string;
  const mdRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (mdRef.current !== null) {
      mdRef.current.innerHTML = "";
      const split = cellValue.split("|");
      renderMarkdown(
        defaultCell,
        `[[${split[1]}|${split[0]}]]`,
        mdRef.current,
        5
      );
    }
  });
  return <span ref={mdRef} className={`${c("md_cell")}`}></span>;
};

export default MarkdownCell;
