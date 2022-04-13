import { DatabaseView } from "DatabaseView";
import { TFolder } from "obsidian";
import { Link } from "obsidian-dataview";
import { Dispatch } from "react";
import { StateManager } from "StateManager";

export type Group = Parameter | Parameters | FolderModel | Models;
type Parameter = {
    input: string,
    optional?: boolean;
}

export type Parameters = {
    [key: string]: Parameter;
}

export type FolderModel = {
    label: string,
    path: string,
    params: Parameters
}

/** Group of FolderModel */
export type Models = {
    [key: string]: FolderModel
}

/** Note type */
export type Note = {
    id: string,
    title: string
}
export type ColumnOptions = {
    label?: string,
    backgroundColor?: string
}

export type TableColumn = {
    Header: string,
    label?: string,
    accessor: string,
    minWidth?: number,
    width?:number
    dataType?: string,
    options?: ColumnOptions[]
    Cell?: any
}

export type RowType = number | string | boolean | Date | Link;
export type TableRow = {
    id: number,
    title: string,
    [key: string]: RowType
}

export type TableRows = Array<TableRow>;

export type TableColumns = Array<TableColumn>;

export type TableDataType={
    columns: TableColumns, 
    data: TableRows, 
    skipReset: boolean,
    view?: DatabaseView,
    stateManager?: StateManager,
    dispatch?: Dispatch<any>
    databaseFolder: TFolder
}
/** database column */
export type DatabaseColumn = {
    input: string,
    Header: string,
    accessor: string,
    [key: string]: string
}
export type DatabaseColumns = {
    [key: string]: DatabaseColumn
}
/** database yaml */
export type DatabaseYaml = {
    /** database name */
    name: string,
    /** database description */
    description: string,
    /** database columns */
    columns: DatabaseColumns
}