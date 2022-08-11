import { CellContext } from "@tanstack/react-table";
import { RowDataType } from "cdm/FolderModel";
import { Literal } from "obsidian-dataview/lib/data-model/value";

export type RowSelectOption = {
    backgroundColor: string,
    label: string,
}

export type PopperProps = {
    defaultCell: CellContext<RowDataType, Literal>;
}

export type TagsProps = {
    defaultCell: CellContext<RowDataType, Literal>;
}

export type CalendarProps = {
    defaultCell: CellContext<RowDataType, Literal>;
}