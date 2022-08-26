import { Row, Table } from "@tanstack/react-table";
import { RowDataType, TableColumn } from "cdm/FolderModel";

export type NavBarProps = {
    table: Table<RowDataType>,
    globalFilterRows: GlobalFilterProps;
};

export type CsvButtonProps = {
    columns: TableColumn[];
    rows: Row<RowDataType>[];
    name: string;
};

export type GlobalFilterProps = {
    setGlobalFilter: (updater: any) => void;
    hits: number;
    globalFilter: string;
};

export type PaginationProps = Pick<NavBarProps, "table">;