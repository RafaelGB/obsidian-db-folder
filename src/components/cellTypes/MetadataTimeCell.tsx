import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import { c } from "helpers/StylesHelper";
import { DateTime } from "luxon";
import React, { useEffect, useRef } from "react";

const MetadataTimeCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell, column } = defaultCell;
  const mdRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (mdRef.current !== null) {
      mdRef.current.innerHTML = "";
      const cellValue = cell.getValue();
      let metadataValue = DateTime.isDateTime(cellValue)
        ? (cellValue as DateTime).toFormat("yyyy-MM-dd h:mm a")
        : null;

      if (metadataValue !== null) {
        metadataValue = `[[${(cellValue as DateTime).toFormat(
          "yyyy-MM-dd"
        )}|${metadataValue}]]`;
      }
      renderMarkdown(defaultCell, metadataValue, mdRef.current, 5);
    }
  });
  return <span ref={mdRef} className={`${c("md_cell")}`}></span>;
};

export default MetadataTimeCell;
