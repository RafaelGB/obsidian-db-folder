import Footer from "automations/Footer";
import { DatabaseHeaderProps, TableColumn } from "cdm/FolderModel";
import { FooterType } from "helpers/Constants";
import React, { MouseEventHandler, useEffect, useState } from "react";
import { showFooterMenu } from "components/obsidianArq/commands";
import { Literal } from "obsidian-dataview";
import { MarkdownService } from "services/MarkdownRenderService";
import { c } from "helpers/StylesHelper";

export default function DefaultFooter(headerProps: DatabaseHeaderProps) {
  /** Properties of footer */
  const { header, table } = headerProps;
  const { tableState, view } = table.options.meta;
  const columnActions = tableState.columns((state) => state.actions);

  /** Column values */
  const tableColumn = header.column.columnDef as TableColumn;
  const formulaInfo = tableState.automations((state) => state.info);
  const [footerType, setFooterValue] = useState(tableColumn.config.footer_type);
  const footerRef = React.useRef<HTMLDivElement>(null);

  const colValues = table.getCoreRowModel().rows.map((row) => {
    return row.getValue<Literal>(header.id);
  });

  const handlerFooterOptions: MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent
  ) => {
    showFooterMenu(
      event.nativeEvent,
      tableColumn,
      columnActions,
      footerType,
      setFooterValue
    );
  };

  useEffect(() => {
    if (footerRef.current !== null) {
      let footerInfo: Literal = "";
      if (footerType === FooterType.FORMULA) {
        footerInfo = formulaInfo.dispatchFooter(tableColumn, colValues);
      } else {
        footerInfo = new Footer(colValues).dispatch(footerType);
      }

      footerRef.current.innerHTML = "";
      MarkdownService.renderStringAsMarkdown(
        view,
        footerInfo?.toString(),
        footerRef.current,
        3
      );
    }
  });

  return (
    <div
      ref={footerRef}
      key={`default-footer-${header.id}-${header.index}`}
      onClick={handlerFooterOptions}
      className={`${c("md_cell")}`}
      style={{
        minHeight: "20px",
      }}
    />
  );
}
