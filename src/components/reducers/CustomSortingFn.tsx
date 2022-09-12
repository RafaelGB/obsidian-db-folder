import { Row, SortingFn } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { InputType } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";

const dbfolderColumnSortingFn: (
  ddbbConfig: LocalSettings
) => SortingFn<RowDataType> =
  (ddbbConfig: LocalSettings) =>
  (
    rowA: Row<RowDataType>,
    rowB: Row<RowDataType>,
    columnId: string
  ): number => {
    const a = DataviewService.parseLiteral(
      rowA.getValue<Literal>(columnId),
      InputType.MARKDOWN,
      ddbbConfig,
      true
    )
      .toString()
      .toLowerCase();
    const b = DataviewService.parseLiteral(
      rowB.getValue<Literal>(columnId),
      InputType.MARKDOWN,
      ddbbConfig,
      true
    )
      .toString()
      .toLowerCase();
    return a === b ? 0 : a > b ? 1 : -1;
  };

export default dbfolderColumnSortingFn;
