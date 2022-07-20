import { Row } from "@tanstack/react-table";
import { RowDataType, TableColumn } from "cdm/FolderModel";

export type NavBarProps = {
    csvButtonProps: CsvButtonProps;
    globalFilterRows: GlobalFilterProps;
    headerGroupProps?: any;
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