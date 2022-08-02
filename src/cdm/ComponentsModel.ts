import NoteInfo from "services/NoteInfo";
import { BaseComponentProps } from "cdm/DatabaseModel";
import { CellContext } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { Literal } from "obsidian-dataview/lib/data-model/value";

export type RowSelectOption = {
    backgroundColor: string,
    label: string,
}
export type PopperProps = {
    dispatch: (action: any) => void;
    defaultCell: CellContext<RowDataType, Literal>;
    note: NoteInfo;
} & BaseComponentProps;


export type TagsProps = {
    dispatch: (action: any) => void;
    defaultCell: CellContext<RowDataType, Literal>;
} & BaseComponentProps;

export type CalendarProps = {
    defaultCell: CellContext<RowDataType, Literal>;
} & BaseComponentProps;