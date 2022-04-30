import { TableColumn } from "cdm/FolderModel";
import { Row } from "react-table";

const getColumnWidthStyle = (rows: Array<Row<object>>, accessor: string, headerText: string, customMaxWidth?: number): number => {
  const maxWidth = (customMaxWidth ?? 400)
  const paddingAndIcons = 16;
  const magicSpacing = 10;

  const cellLength = Math.max(
    ...rows.map((row: any) => (`${row.original[accessor]}` || '').length),
    headerText.length, paddingAndIcons
  )
  return Math.min(maxWidth, cellLength * magicSpacing)
}

const getColumnsWidthStyle = (rows: Array<Row<object>>, columns: TableColumn[]): Record<string, number> => {
  const columnWidthStyle: Record<string, number> = {}
  columns.forEach((column: TableColumn) => {
    columnWidthStyle[column.id] = getColumnWidthStyle(rows, column.key, column.label)
  })
  return columnWidthStyle
}
export default getColumnsWidthStyle;