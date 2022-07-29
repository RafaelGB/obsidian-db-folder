import { ColumnSort, SortingState } from "@tanstack/react-table";
import { InitialType, RowDataType, TableColumn } from "cdm/FolderModel";

export interface ConfigState {

}
export interface InitialState {
    state: InitialType;
    alterSortBy: (sortBy: ColumnSort[]) => void;
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
    alterSorting: (column: TableColumn) => void;
}
export interface ColumnSortingState {
    state: SortingState;
    modify: (alternativeSorting: SortingState) => void;
    generateSorting: (currentCol: TableColumn, isSortedDesc: boolean) => SortingState;
}
export interface RowTemplateState {
    template: string;
    folder: string;
    options: { value: string, label: string }[],
    clear: () => void;
    update: (template: string) => void;
}

export interface TableStateInterface {
    initialState: InitialState;
    rowTemplate: RowTemplateState;
    data: DataState;
    sorting: ColumnSortingState;
    columns: ColumnsState;
}