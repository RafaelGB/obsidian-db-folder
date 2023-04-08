import { CellContext, Table } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { Link, Literal } from "obsidian-dataview/lib/data-model/value";
import { AtomicFilter, FilterGroup } from "cdm/SettingsModel";

export type ColumnOption = {
    value: string;
    label: string;
    color: string;
    // Deprecated
    backgroundColor?: string;
}

export type SelectValue = {
    label: string;
    value: string;
};

export type CellComponentProps = {
    defaultCell: CellContext<RowDataType, Literal>;
}

export type EditorCellComponentProps = {
    persistChange: (changedValue: string) => Promise<void>;
    textCell: string;
} & CellComponentProps;

export type RelationEditorComponentProps = {
    persistChange: (newPath: string[]) => void;
    relationCell: Link[];
} & CellComponentProps;

export type TableFiltersProps = {
    table: Table<RowDataType>;
};

export type DataviewFiltersProps = {
    table: Table<RowDataType>;
    possibleColumns: ColumnFilterOption[];
} & TableFiltersProps;

export type AtomicFilterComponentProps = {
    recursiveIndex: number[];
    level: number;
    atomicFilter: AtomicFilter;
} & DataviewFiltersProps;

export type ColumnFilterOption = {
    key: string;
    enabled: boolean;
    type: string;
}

export type GroupFilterComponentProps = {
    group: FilterGroup;
    recursiveIndex: number[];
    level: number;
    table: Table<RowDataType>;
    possibleColumns: ColumnFilterOption[];
};