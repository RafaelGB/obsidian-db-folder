import Footer from "automations/Footer";
import { DatabaseHeaderProps, TableColumn } from "cdm/FolderModel";
import { FooterType } from "helpers/Constants";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import React, { MouseEventHandler, useState } from "react";
import { showFooterMenu } from "components/obsidianArq/commands";
import { Literal } from "obsidian-dataview";

export default function DefaultFooter(headerProps: DatabaseHeaderProps) {
  /** Properties of footer */
  const { header, table } = headerProps;
  const { tableState } = table.options.meta;
  const configInfo = tableState.configState((state) => state.info);
  const columnActions = tableState.columns((state) => state.actions);

  /** Column values */
  const tableColumn = header.column.columnDef as TableColumn;
  const formulaInfo = tableState.automations((state) => state.info);
  const [footerType, setFooterValue] = useState(tableColumn.config.footer_type);
  const { config } = tableColumn;
  let footerInfo: Literal = "";
  if (config.footer_type === FooterType.FORMULA) {
    footerInfo = formulaInfo.dispatchFooter(
      tableColumn,
      table.getRowModel().rows
    );
  } else {
    footerInfo = new Footer(table.getRowModel().rows).dispatch(
      footerType,
      header.id
    );
  }
  const handlerFooterOptions: MouseEventHandler<HTMLDivElement> = async (
    event: React.MouseEvent
  ) => {
    await showFooterMenu(
      event.nativeEvent,
      tableColumn,
      columnActions,
      footerType,
      setFooterValue
    );
  };

  return (
    <div
      key={`foot-th-cell-${header.id}`}
      className={`${c(
        getAlignmentClassname(config, configInfo.getLocalSettings())
      )}`}
      onClick={handlerFooterOptions}
      style={{
        minHeight: "20px",
      }}
    >
      {footerInfo?.toString()}
    </div>
  );
}
