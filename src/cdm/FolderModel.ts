import { DatabaseView } from "DatabaseView";
import { Dispatch } from "react";
import StateManager from "StateManager";
import { RowType } from "cdm/RowTypeModel";
import { RowSelectOption } from "cdm/RowSelectModel";
import NoteInfo from "services/NoteInfo";
import { TFile } from "obsidian";
import { DatabaseColumn } from "cdm/DatabaseModel";
import { Column } from "react-table";

export type Group = Parameter | Parameters | FolderModel | Models;
type Parameter = {
    input: string,
    optional?: boolean;
}

export interface NormalizedPath {
    root: string;
    subpath: string;
    alias: string;
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

export interface TableColumn {
    id: string;
    label: string;
    key: string;
    position: number;
    accessor: any;
    minWidth?: number;
    width?: number;
    dataType?: string;
    options?: RowSelectOption[];
    Cell?: any;
    getHeaderProps?: any;
    getResizerProps?: any;
    isMetadata?: boolean;
    skipPersist?: boolean;
    isInline?: boolean;
    csvCandidate: boolean;
}

export type RowDataType = {
    id: number,
    note: NoteInfo,
    [key: string]: RowType
}

export type TableDataType = {
    columns: TableColumn[],
    shadowColumns: TableColumn[],
    data: Array<RowDataType>,
    skipReset: boolean,
    view: DatabaseView,
    stateManager: StateManager,
    dispatch?: Dispatch<any>
}
export interface DatabaseHeaderProps {
    columns: any,
    data: any,
    initialState: TableDataType,
    defaultColumn: any,
    getSubRows: any,
    getRowId: any,
    stateReducer: any,
    useControlledState: any,
    plugins: any,
    getHooks: any,
    state: any,
    dispatch: any,
    allColumns: Column[],
    setColumnOrder: (cols: string[]) => void,
    rows: any,
    initialRows: any,
    flatRows: any,
    rowsById: any,
    headerGroups: any,
    headers: any, flatHeaders: any,
    visibleColumns: any,
    totalColumnsMinWidth: any,
    totalColumnsWidth: any,
    totalColumnsMaxWidth: any,
    allColumnsHidden: any,
    toggleHideColumn: any,
    setHiddenColumns: any,
    toggleHideAllColumns: any,
    getToggleHideAllColumnsProps: any,
    resetResizing: any,
    preSortedRows: any,
    preSortedFlatRows: any,
    sortedRows: any,
    sortedFlatRows: any,
    setSortBy: any,
    toggleSortBy: any,
    rowSpanHeaders: any,
    footerGroups: any,
    prepareRow: any,
    getTableProps: any,
    getTableBodyProps: any,
    column: TableColumn
}

export type RelationshipProps = {
    value: any,
    backgroundColor: string
}

export type NoteContentAction = {
    file: TFile,
    action: string,
    regexp: RegExp,
    newValue?: string
}