import { Row } from "@tanstack/react-table"
import { RowDataType } from "./FolderModel"
import { TableStateInterface } from "cdm/TableStateInterface"

export type TableCellProps = {
    row: Row<RowDataType>,
    rowIndex: number,
    tableStore: TableStateInterface
}