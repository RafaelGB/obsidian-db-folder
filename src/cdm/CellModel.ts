import { Row } from "@tanstack/react-table"
import { RowDataType } from "cdm/FolderModel"
import { TableStateInterface } from "cdm/TableStateInterface"

export type TableCellProps = {
    row: Row<RowDataType>,
    rowIndex: number,
    tableStore: TableStateInterface
}