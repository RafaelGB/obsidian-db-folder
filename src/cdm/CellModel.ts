import { Row } from "@tanstack/react-table"
import { RowDataType } from "./FolderModel"

export type TableCellProps = {
    row: Row<RowDataType>,
    rowIndex: number
}