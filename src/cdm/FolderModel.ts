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

export type RowSelectOption = {
    backgroundColor: string,
    label: string,
}

export type TableColumn = {
    id: string,
    Header?: any,
    label?: string,
    accessor: string,
    minWidth?: number,
    width?:number
    dataType?: string,
    options?: RowSelectOption[]
    Cell?: any,
    getHeaderProps?: any,
    getResizerProps?: any,
    isMetadata?: boolean
}

export type RowType = number | string | boolean | Date | Link | RowSelectOption[];
export type TableRow = {
    id: number,
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
    label: string,
    isMetadata: boolean,
    [key: string]: RowType
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

export interface DatabaseHeaderProps{
    columns:any,
    data:any,
    initialState:any,
    defaultColumn:any,
    getSubRows:any,
    getRowId:any,
    stateReducer:any,
    useControlledState:any,
    plugins:any,
    getHooks:any,
    state:any,
    dispatch:any,
    allColumns:any,
    rows:any,
    initialRows:any,
    flatRows:any,
    rowsById:any,
    headerGroups:any,
    headers:any,flatHeaders:any,
    visibleColumns:any,
    totalColumnsMinWidth:any,
    totalColumnsWidth:any,
    totalColumnsMaxWidth:any,
    allColumnsHidden:any,
    toggleHideColumn:any,
    setHiddenColumns:any,
    toggleHideAllColumns:any,
    getToggleHideAllColumnsProps:any,
    resetResizing:any,
    preSortedRows:any,
    preSortedFlatRows:any,
    sortedRows:any,
    sortedFlatRows:any,
    setSortBy:any,
    toggleSortBy:any,
    rowSpanHeaders:any,
    footerGroups:any,
    prepareRow:any,
    getTableProps:any,
    getTableBodyProps:any,
    column: TableColumn
}

export type RelationshipProps = {
    value:any,
    backgroundColor:string
}