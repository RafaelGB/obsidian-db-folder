import { TableColumn } from "cdm/FolderModel";
import {
  DEFAULT_COLUMN_CONFIG,
  InputType,
  MetadataDatabaseColumns,
} from "helpers/Constants";
import React from "react";
import HeaderContextMenu from "components/contextMenu/HeaderContextMenu";
import CellContextMenu from "components/contextMenu/CellContextMenu";

const rowContextMenuColumn: TableColumn = {
  ...MetadataDatabaseColumns.ROW_CONTEXT_MENU,
  input: InputType.TEXT,
  config: DEFAULT_COLUMN_CONFIG,
  position: 0,
  width: 30,
  maxSize: 30,
  header: (headerContext) => <HeaderContextMenu {...headerContext} />,
  cell: (cellContext) => <CellContextMenu {...cellContext} />,
};
export default rowContextMenuColumn;
