import { CellComponentProps } from "cdm/ComponentsModel";
import { c } from "helpers/StylesHelper";
import React, { useEffect, useRef } from "react";
import { MarkdownService } from "services/MarkdownRenderService";

const MetadataTagsCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { table, row, column } = defaultCell;
  const { tableState } = table.options.meta;
  const metaTagsRow = tableState.data((state) => state.rows[row.index]);
  const mdRef = useRef<HTMLDivElement>();
  useEffect(() => {
    if (mdRef.current === null) return;

    const metaTags = metaTagsRow[column.id] as string[];
    MarkdownService.renderMarkdown(
      defaultCell,
      metaTags.join(" "),
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

export default MetadataTagsCell;
