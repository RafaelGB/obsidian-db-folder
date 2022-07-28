import { DatabaseView } from "DatabaseView";
import { Dispatch } from "react";
import StateManager from "StateManager";
import { RowSelectOption } from "cdm/ComponentsModel";
import NoteInfo from "services/NoteInfo";
import { TFile } from "obsidian";
import { Column, ColumnSort, Header, Table } from "@tanstack/react-table";
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
    task_hide_completed?: boolean;
    [key: string]: Literal;
}

export interface BaseColumn {
    accessorKey: string;
    label: string;
    key: string;
    input: string;
    csvCandidate?: boolean;
    options?: RowSelectOption[];
    width?: number;
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
    options?: RowSelectOption[];
    Cell?: any;
    getHeaderProps?: any;
    getResizerProps?: any;
}

export type RowDataType = {
    __note__: NoteInfo,
    [key: string]: Literal | NoteInfo
}

export type InitialState = {
    sortBy?: ColumnSort[],
}

export type TableDataType = {
    shadowColumns: TableColumn[],
    skipReset: boolean,
    view: DatabaseView,
    stateManager: StateManager,
    dispatch?: Dispatch<any>,
    initialState?: InitialState,
}

export interface DatabaseHeaderProps {
    column: Column<RowDataType, any>,
    header: Header<RowDataType, TableColumn>,
    table: Table<RowDataType>
}

export type RelationshipProps = {
    value: any,
    backgroundColor: string
}

export type RowTemplateOption = {
    label: string,
    value: string
}

export type NoteContentAction = {
    file: TFile,
    action: string,
    regexp: RegExp,
    content?: string,
    newValue?: string
}