import { Cell, Column, Table } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";

export type CellProps = {
    cell: Cell<RowDataType, any>,
    column: Column<RowDataType, unknown>;
    row: any;
    table: Table<RowDataType>;
    [key: string]: any;
}

export type TableCellProps = {
    row: any,
    rowIndex: any
}