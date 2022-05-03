import { TableColumn } from "cdm/FolderModel";
import { MetadataColumns } from "helpers/Constants";
import { getNormalizedPath } from "helpers/VaultManagement";
import { Row } from "react-table";

const getColumnWidthStyle = (rows: Array<Row<object>>, accessor: string, headerText: string, customMaxWidth?: number): number => {
  const maxWidth = (customMaxWidth ?? 400)
  const IconsSpacing = 28;
  const magicSpacing = 10;

  const cellLength = Math.max(
    ...rows.map((row: any) => lengthOfNormalizeCellValue(row, accessor)),
    headerText.length, IconsSpacing
  )
  return Math.min(maxWidth, cellLength * magicSpacing)
}

const lengthOfNormalizeCellValue = (row: any, accessor: string): number => {
  const value = (`${row.original[accessor]}` || '');
  switch (accessor) {
    case MetadataColumns.FILE:
      return getNormalizedPath(value).alias.length
  }
  return value.length
}

const getColumnsWidthStyle = (rows: Array<Row<object>>, columns: TableColumn[]): Record<string, number> => {
  const columnWidthStyle: Record<string, number> = {}
  columns.forEach((column: TableColumn) => {
    columnWidthStyle[column.id] = getColumnWidthStyle(rows, column.key, column.label)
  })
  return columnWidthStyle
}
export default getColumnsWidthStyle;