import { TableColumn } from "cdm/FolderModel";
import { ColumnWidthState } from "cdm/StyleModel";
import { DataTypes, MetadataColumns, WidthVariables } from "helpers/Constants";
import { getNormalizedPath } from "helpers/VaultManagement";
import { DateTime } from "luxon";
import { HSLColor } from "react-color";
import { Row } from "react-table";

export const getColumnWidthStyle = (rows: Array<Row<object>>, column: TableColumn, customMaxWidth?: number): number => {
  const maxWidth = (customMaxWidth ?? 400)

  const cellLength = Math.max(
    ...rows.map((row: any) => lengthOfNormalizeCellValue(row, column)),
    column.label.length, WidthVariables.ICON_SPACING
  )
  return Math.min(maxWidth, cellLength * WidthVariables.MAGIC_SPACING)
}

/**
 * Obtain length of a cell value in function of its type and render strategy
 * @param row 
 * @param column 
 * @returns 
 */
const lengthOfNormalizeCellValue = (row: any, column: TableColumn): number => {
  const value = (`${row.original[column.key]}` || '');
  let result = 0;
  switch (column.dataType) {
    case DataTypes.MARKDOWN:
      result = getNormalizedPath(value).alias.length
      break;
    case DataTypes.CALENDAR:
      result = DateTime.isDateTime(value) ? value.toFormat('yyyy-MM-dd').length : 0
      break;
    default:
      result = value.length
  }
  return result
}

export const getColumnsWidthStyle = (rows: Array<Row<object>>, columns: TableColumn[]): ColumnWidthState => {
  const columnWidthStyle: ColumnWidthState = {
    widthRecord: {}
  }
  columns.forEach((column: TableColumn) => {
    columnWidthStyle.widthRecord[column.id] = getColumnWidthStyle(rows, column);
  })
  return columnWidthStyle;
}

export function castHslToString(color: HSLColor): string {
  return `hsl(${color.h},${color.s * 100}%,${color.l * 100}%)`;
}