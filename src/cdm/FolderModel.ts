import { DatabaseView } from "DatabaseView";
import { Dispatch } from "react";
import { StateManager } from "StateManager";
import { DatabaseYaml } from "cdm/DatabaseModel";
import { RowType } from "cdm/RowTypeModel";
import { RowSelectOption } from "cdm/RowSelectModel";
import DatabaseInfo from "services/DatabaseInfo";
import NoteInfo from "services/NoteInfo";
import { TFile } from "obsidian";

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

export type TableColumn = {
    id: string,
    Header?: any,
    label?: string,
    key: string,
    accessor: any,
    minWidth?: number,
    width?:number
    dataType?: string,
    options?: RowSelectOption[]
    Cell?: any,
    getHeaderProps?: any,
    getResizerProps?: any,
    isMetadata?: boolean
}

export type TableRow = {
    id: number,
    note: NoteInfo,
    [key: string]: RowType
}

export type TableColumns = Array<TableColumn>;

export type TableDataType={
    columns: TableColumns, 
    data: Array<TableRow>, 
    skipReset: boolean,
    view: DatabaseView,
    stateManager?: StateManager,
    dispatch?: Dispatch<any>,
    diskConfig: DatabaseInfo
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

export type NoteContentAction = {
    file:TFile,
    action:string,
    regexp:RegExp,
    newValue:string
}