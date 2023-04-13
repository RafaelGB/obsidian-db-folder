import { CellContext } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { Link, Literal } from "obsidian-dataview/lib/data-model/value";

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