import { CellComponentProps } from "cdm/ComponentsModel";
import { c } from "helpers/StylesHelper";
import { DateTime } from "luxon";
import React, { useEffect, useRef } from "react";
import { MarkdownService } from "services/MarkdownRenderService";

const MetadataTimeCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell, table } = defaultCell;
  const { tableState } = table.options.meta;
  const configInfo = tableState.configState((state) => state.info);
  const mdRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (mdRef.current !== null) {
      mdRef.current.innerHTML = "";
      const cellValue = cell.getValue();
      // Apply config formatting
      let metadataValue = (cellValue as DateTime).toFormat(
        configInfo.getLocalSettings().metadata_date_format
      );
      // Render the markdown with daily notes link
      // TODO obtain daily format from dailies plugin if its enabled
      metadataValue = `[[${(cellValue as DateTime).toFormat(
        "yyyy-MM-dd"
      )}|${metadataValue}]]`;

      MarkdownService.renderMarkdown(
        defaultCell,
        metadataValue,
        mdRef.current,
        5
      );
    }
  });

  return (
    <span
      ref={mdRef}
      className={`${c("md_cell tabIndex")}`}
      key={`metadata_time_${cell.id}`}
      tabIndex={0}
    />
  );
};

export default MetadataTimeCell;
