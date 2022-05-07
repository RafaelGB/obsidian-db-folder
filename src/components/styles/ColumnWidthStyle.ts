import { TableColumn } from "cdm/FolderModel";
import { ColumnWidthState } from "cdm/StyleModel";
import { MetadataColumns, WidthVariables } from "helpers/Constants";
import { getNormalizedPath } from "helpers/VaultManagement";
import { Row } from "react-table";

const getColumnWidthStyle = (rows: Array<Row<object>>, accessor: string, headerText: string, customMaxWidth?: number): number => {
  const maxWidth = (customMaxWidth ?? 400)

  const cellLength = Math.max(
    ...rows.map((row: any) => lengthOfNormalizeCellValue(row, accessor)),
    headerText.length, WidthVariables.ICON_SPACING
  )
  return Math.min(maxWidth, cellLength * WidthVariables.MAGIC_SPACING)
}

const lengthOfNormalizeCellValue = (row: any, accessor: string): number => {
  const value = (`${row.original[accessor]}` || '');
  switch (accessor) {
    case MetadataColumns.FILE:
      return getNormalizedPath(value).alias.length
  }
  return value.length
}

const getColumnsWidthStyle = (rows: Array<Row<object>>, columns: TableColumn[]): ColumnWidthState => {
  const columnWidthStyle: ColumnWidthState = {
    widthRecord: {}
  }
  columns.forEach((column: TableColumn) => {
    columnWidthStyle.widthRecord[column.id] = getColumnWidthStyle(rows, column.key, column.label);
  })
  return columnWidthStyle
}
export default getColumnsWidthStyle;