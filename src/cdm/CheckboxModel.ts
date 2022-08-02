
import { CellContext } from "@tanstack/react-table";
import { BaseComponentProps } from "cdm/DatabaseModel";
import { Literal } from "obsidian-dataview";
import { RowDataType } from "cdm/FolderModel";
export type CheckboxProps = {
    defaultCell: CellContext<RowDataType, Literal>;
} & BaseComponentProps;