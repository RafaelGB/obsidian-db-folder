import { Row, SortingFn } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { InputType } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { ParseService } from "services/ParseService";

const dbfolderColumnSortingFn: (
  ddbbConfig: LocalSettings
) => SortingFn<RowDataType> =
  /**
   *  Custom sorting function for the dbfolder column. Global target
   * @param ddbbConfig required to parse correctly Dates
   * @returns
   */


    (ddbbConfig: LocalSettings) =>
    (
      rowA: Row<RowDataType>,
      rowB: Row<RowDataType>,
      columnId: string
    ): number => {
      const cellA = rowA.getValue<Literal>(columnId);
      const cellB = rowB.getValue<Literal>(columnId);

      // If both are numbers, compare as numbers
      if (!Number.isNaN(cellA) && !Number.isNaN(cellB)) {
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
