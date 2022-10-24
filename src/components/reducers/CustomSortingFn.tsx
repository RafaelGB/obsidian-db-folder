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
    const cellA = rowA.getValue<Literal>(columnId);
    const cellB = rowB.getValue<Literal>(columnId);
    // Check if a and b are numbers
    const aIsNumber = !isNaN(Number(cellA));
    const bIsNumber = !isNaN(Number(cellB));

    // If both are numbers, compare as numbers
    if (aIsNumber && bIsNumber) {
      return Number(cellA) - Number(cellB);
    }

    // If both are strings, compare as strings
    const a = ParseService.parseLiteral(
      cellA,
      InputType.SORTING,
      ddbbConfig,
      true
    )
      .toString()
      .toLowerCase();
    const b = ParseService.parseLiteral(
      cellB,
      InputType.SORTING,
      ddbbConfig,
      true
    )
      .toString()
      .toLowerCase();

    // String comparison
    return a === b ? 0 : a > b ? 1 : -1;
  };

export default dbfolderColumnSortingFn;
