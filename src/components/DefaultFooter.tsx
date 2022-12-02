import Footer from "automations/Footer";
import { DatabaseHeaderProps, TableColumn } from "cdm/FolderModel";
import { InputType } from "helpers/Constants";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import React, { MouseEventHandler } from "react";
import { showFooterMenu } from "components/obsidianArq/commands";

export default function DefaultFooter(headerProps: DatabaseHeaderProps) {
  /** Properties of footer */
  const { header, table } = headerProps;
  const { tableState } = table.options.meta;
  const configInfo = tableState.configState((state) => state.info);
  /** Column values */
  const tableColumn = header.column.columnDef as TableColumn;
  const { input, config } = tableColumn;
  let footerInfo: string;
  switch (input) {
    case InputType.NUMBER:
      footerInfo = new Footer(table.getRowModel().rows).sum(header.id);
      break;
    default:
      return null;
    // Do nothing
  }

  const handlerContextMenu: MouseEventHandler<HTMLDivElement> = (
    event: React.MouseEvent
  ) => {
    showFooterMenu(event.nativeEvent, tableColumn);
  };

  return (
    <div
      key={`foot-th-cell-${header.id}`}
      className={c(
        getAlignmentClassname(config, configInfo.getLocalSettings())
      )}
      onContextMenu={handlerContextMenu}
    >
      {footerInfo}
    </div>
  );
}
