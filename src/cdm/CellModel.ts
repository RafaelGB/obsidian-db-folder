import { Row, Table } from "@tanstack/react-table"
import { RowDataType } from "cdm/FolderModel"

export type TableCellProps = {
    row: Row<RowDataType>,
    table: Table<RowDataType>
}