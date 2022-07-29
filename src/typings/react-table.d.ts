import '@tanstack/table-table';
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { TableStateInterface } from "cdm/TableStateInterface";
import { DatabaseView } from 'DatabaseView';

declare module '@tanstack/react-table' {
    interface TableMeta<TData extends RowDataType> {
        tableState: TableStateInterface;
        dispatch: (action: any) => void;
        view: DatabaseView;
        shadowColumns: TableColumn[];
    }
}