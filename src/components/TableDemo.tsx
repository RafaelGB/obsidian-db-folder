import * as React from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import {
  TableDataType,
  RowDataType,
  TableColumn,
  RowTemplateOption,
} from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import StateManager from "StateManager";
import { getNormalizedPath } from "helpers/VaultManagement";
import { ActionTypes, DatabaseCore, MetadataColumns } from "helpers/Constants";
import PlusIcon from "components/img/Plus";
import { LOGGER } from "services/Logger";
import DefaultCell from "components/Cell";
import Header from "components/Header";
import { c, getTotalWidth } from "helpers/StylesHelper";
import { HeaderNavBar } from "components/NavBar";
import { getColumnsWidthStyle } from "components/styles/ColumnWidthStyle";
import { HeaderContext } from "components/contexts/HeaderContext";
import { getDndListStyle, getDndItemStyle } from "components/styles/DnDStyle";
import CustomTemplateSelectorStyles from "components/styles/RowTemplateStyles";
import Select, { ActionMeta, OnChangeValue } from "react-select";
import { get_tfiles_from_folder } from "helpers/FileManagement";

const defaultColumn = {
  minWidth: 25,
  maxWidth: 400,
  Cell: DefaultCell,
  Header: Header,
  sortType: "alphanumericFalsyLast",
};

/**
 * Table component based on react-table
 * @param tableDataType
 * @returns
 */
export function TableDemo(tableData: TableDataType) {
  return <div>Hola buenas tardes</div>;
}
