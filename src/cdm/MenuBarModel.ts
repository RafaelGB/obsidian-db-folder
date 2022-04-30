import { Row } from "react-table";
import { TableColumn } from "cdm/FolderModel";

export type CsvButtonProps = {
    columns: TableColumn[];
    rows: Row<object>[];
    name: string;
};

export type GlobalFilterProps = {
    preGlobalFilteredRows: any;
    setGlobalFilter: any;
    globalFilter: any;
};