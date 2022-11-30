import { Header, Table } from "@tanstack/react-table";
import { RowDataType, TableColumn } from "cdm/FolderModel";

export type TableFooterProps = {
    table: Table<RowDataType>;
    header: Header<RowDataType, TableColumn>;
    headerIndex: number;
};