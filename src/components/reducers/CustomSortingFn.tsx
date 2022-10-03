import { Row, SortingFn } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { InputType } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { ParseService } from "services/ParseService";

const dbfolderColumnSortingFn: (
  ddbbConfig: LocalSettings
) => SortingFn<RowDataType> =
  (ddbbConfig: LocalSettings) =>
  (
    rowA: Row<RowDataType>,
    rowB: Row<RowDataType>,
    columnId: string
  ): number => {
    const a = ParseService.parseLiteral(
      rowA.getValue<Literal>(columnId),
      InputType.MARKDOWN,
      ddbbConfig,
      true
    )
      .toString()
      .toLowerCase();
    const b = ParseService.parseLiteral(
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
