import { Row, Table } from "@tanstack/react-table";
import { RowDataType, TableColumn } from "cdm/FolderModel";

export type NavBarProps = {
    table: Table<RowDataType>,
    globalFilterRows: GlobalFilterProps;
};

export type TableActionProps = {
    table: Table<RowDataType>,
};

export type AddRowProps = {
    table: Table<RowDataType>
};

export type CsvButtonProps = {
    columns: TableColumn[];
    rows: Row<RowDataType>[];
    name: string;
};

export type GlobalFilterProps = {
    setGlobalFilter: (updater: any) => void;
    globalFilter: string;
};

export type PaginationProps = Pick<NavBarProps, "table">;
