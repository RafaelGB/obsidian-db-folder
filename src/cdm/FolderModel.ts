import StateManager from "StateManager";
import { RowSelectOption } from "cdm/ComponentsModel";
import { TableStateInterface } from "cdm/TableStateInterface";
import NoteInfo from "services/NoteInfo";
import { TFile } from "obsidian";
import { Column, ColumnDef, ColumnSort, Header, Table } from "@tanstack/react-table";
import { Literal } from "obsidian-dataview/lib/data-model/value";
import { CustomView } from "views/AbstractView";

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
    /** Mandatory */
    enable_media_view: boolean;
    media_width: number;
    media_height: number;
    isInline: boolean;
    persist_changes: boolean;
    /** Circunstancial */
    content_alignment?: string;
    content_vertical_alignment?: string;
    wrap_content?: boolean;
    // Text
    link_alias_enabled?: boolean;
    custom_link_alias?: string;
    // Tasks
    task_hide_completed?: boolean;
    // Formulas
    formula_query?: string;
    // Relations
    related_note_path?: string;
    bidirectional_relation?: boolean;
    relation_color?: string;
    // Rollups
    asociated_relation_id?: string;
    rollup_action?: string;
    rollup_key?: string;
    // Footer
    footer_type: string;
    footer_formula?: string;
    /** Extras from yaml */
    [key: string]: Literal;
}

export type BaseColumn = {
    /** Mandatory */
    accessorKey: string;
    label: string;
    key: string;
    input: string;
    config: ConfigColumn;
    /** Circunstancial */
    nestedKey?: string;
    csvCandidate?: boolean;
    width?: number;
    position?: number;
    isMetadata?: boolean;
    isSorted?: boolean;
    isSortedDesc?: boolean;
    sortIndex?: number;
    isHidden?: boolean;
    skipPersist?: boolean;
    isDragDisabled?: boolean;
    // Selects & Tags
    options?: RowSelectOption[];
}

export type TableColumn = ColumnDef<RowDataType, Literal> & BaseColumn;

export type RowDataType = {
    __note__: NoteInfo,
    [key: string]: Literal | NoteInfo
}

export type InitialType = {
    sortBy?: ColumnSort[],
}

export type TableDataType = {
    skipReset: boolean,
    view: CustomView,
    stateManager: StateManager,
    tableStore?: TableStateInterface
}
export interface DatabaseHeaderProps {
    column: Column<RowDataType, Literal>,
    header: Header<RowDataType, Literal>,
    table: Table<RowDataType>
}

export type RelationshipProps = {
    value: Literal,
    backgroundColor: string
    view: CustomView,
}

export type RowTemplateOption = {
    label: string,
    value: string
}

export type NoteContentAction = {
    file: TFile,
    action: string,
    regexp: RegExp[],
    content: string,
    newValue: string[]
}