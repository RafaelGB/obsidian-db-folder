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
    let footerInfo: Literal = "";
    if (footerType === FooterType.FORMULA) {
      const colValues = table.getCoreRowModel().rows.map((row) => {
        return row.getValue<Literal>(header.id);
      });
      footerInfo = formulaInfo.dispatchFooter(tableColumn, colValues);
    } else {
      footerInfo = new Footer(table.getCoreRowModel().rows).dispatch(
        footerType,
        header.id
      );
    }

    if (footerRef.current !== null) {
      footerRef.current.innerHTML = "";
      MarkdownService.renderStringAsMarkdown(
        view,
        footerInfo?.toString(),
        footerRef.current,
        3
      );
    }
  }, [footerType]);

  return (
    <div
      ref={footerRef}
      key={`default-footer-${header.id}`}
      onClick={handlerFooterOptions}
      className={`${c("md_cell")}`}
      style={{
        minHeight: "20px",
      }}
    />
  );
}
