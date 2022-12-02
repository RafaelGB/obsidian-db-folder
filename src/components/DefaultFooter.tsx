import Footer from "automations/Footer";
import { DatabaseHeaderProps, TableColumn } from "cdm/FolderModel";
import { FooterType } from "helpers/Constants";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import React, { MouseEventHandler, useState } from "react";
import { showFooterMenu } from "components/obsidianArq/commands";

export default function DefaultFooter(headerProps: DatabaseHeaderProps) {
  /** Properties of footer */
  const { header, table } = headerProps;
  const { tableState } = table.options.meta;
  const configInfo = tableState.configState((state) => state.info);
  const columnActions = tableState.columns((state) => state.actions);

  /** Column values */
  const tableColumn = header.column.columnDef as TableColumn;
  const [footerType, setFooterValue] = useState(tableColumn.config.footer_type);
  const { config } = tableColumn;
  let footerInfo: string = "";

  const footerRule = new Footer(table.getRowModel().rows);
  switch (footerType) {
    case FooterType.COUNT_UNIQUE:
      footerInfo = footerRule.countUnique(header.id);
      break;
    case FooterType.COUNT_EMPTY:
      footerInfo = footerRule.percentEmpty(header.id);
      break;
    case FooterType.COUNT_FILLED:
      footerInfo = footerRule.percentFilled(header.id);
      break;
    case FooterType.SUM:
      footerInfo = footerRule.sum(header.id);
      break;
    case FooterType.NONE:
    default:
      footerInfo = "";
  }

  const handlerFooterOptions: MouseEventHandler<HTMLDivElement> = async (
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
      {footerInfo}
    </div>
  );
}
