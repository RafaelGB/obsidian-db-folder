import '@tanstack/table-table';
import { RowDataType } from "cdm/FolderModel";
import { TableStateInterface } from "cdm/TableStateInterface";
import { DatabaseView } from 'DatabaseView';

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowDataType> {
        tableState: TableStateInterface;
        view: DatabaseView;
    }
}