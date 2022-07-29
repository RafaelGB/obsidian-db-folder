import { SortingState } from "@tanstack/react-table";
import { RowDataType, TableColumn } from "cdm/FolderModel";

export interface ConfigState {

}
export interface ColumnSortingState {
    state: SortingState;
    modify: (alternativeSorting: SortingState) => void;
    generateSorting: (currentCol: TableColumn, isSortedDesc: boolean) => SortingState;
}
export interface DataState {
    rows: RowDataType[];
    add: (row: RowDataType) => void;
    remove: (row: RowDataType) => void;
}
export interface ColumnsState {
    state: TableColumn[];
    add: (column: TableColumn, position: number) => void;
    remove: (column: TableColumn) => void;
}

export interface RowTemplateState {
    template: string;
    folder: string;
    options: { value: string, label: string }[],
    clear: () => void;
    update: (template: string) => void;
}

export interface TableStateInterface {
    rowTemplate: RowTemplateState;
    data: DataState;

    sorting: ColumnSortingState;
    columns: ColumnsState;
}