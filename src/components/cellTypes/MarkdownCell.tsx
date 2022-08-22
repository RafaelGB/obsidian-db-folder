import { CellComponentProps } from "cdm/ComponentsModel";
import { renderMarkdown } from "components/markdown/MarkdownRenderer";
import { c } from "helpers/StylesHelper";
import React, { useEffect, useRef } from "react";

const MarkdownCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell } = defaultCell;
  const cellValue = cell.getValue();
  const mdRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (mdRef.current !== null) {
      mdRef.current.innerHTML = "";
      renderMarkdown(defaultCell, cellValue?.toString(), mdRef.current, 5);
    }
  });
  return <span ref={mdRef} className={`${c("md_cell")}`}></span>;
};

export default MarkdownCell;
