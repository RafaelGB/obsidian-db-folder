import { DatabaseView } from "DatabaseView";
import { Dispatch } from "react";
import StateManager from "StateManager";
import { RowSelectOption } from "cdm/RowSelectModel";
import NoteInfo from "services/NoteInfo";
import { TFile } from "obsidian";
import { Column } from "react-table";
import { Literal } from "obsidian-dataview/lib/data-model/value";

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

export interface ConfigColumn {
    enable_media_view: boolean;
    media_width: number;
    media_height: number;
    isInline: boolean;
    [key: string]: Literal;
}

export interface BaseColumn {
    csvCandidate?: boolean;
    accessor: string;
    label: string;
    key: string;
    position?: number;
    isMetadata?: boolean;
    skipPersist?: boolean;
    isDragDisabled?: boolean;
    config: ConfigColumn;
}
export interface TableColumn extends BaseColumn {
    isSortedDesc?: boolean;
    isSorted?: boolean;
    id: string;
    minWidth?: number;
    width?: number;
    dataType: string;
    options?: RowSelectOption[];
    Cell?: any;
    getHeaderProps?: any;
    getResizerProps?: any;
}

export type RowDataType = {
    id: number,
    note: NoteInfo,
    [key: string]: Literal | NoteInfo
}

export type SortByElement = {
    id: string;
    desc: boolean;
}
export type InitialState = {
    sortBy?: SortByElement[],
}

export type TableDataType = {
    columns: TableColumn[],
    shadowColumns: TableColumn[],
    data: Array<RowDataType>,
    skipReset: boolean,
    view: DatabaseView,
    stateManager: StateManager,
    dispatch?: Dispatch<any>,
    initialState?: InitialState,
    cellSize: string
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
    content?: string,
    newValue?: string
}