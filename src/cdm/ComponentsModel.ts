import { ActionType, Cell } from "react-table";
import NoteInfo from "services/NoteInfo";
import { TableColumn, TableDataType } from "cdm/FolderModel";
import { BaseComponentProps } from "cdm/DatabaseModel";

export type RowSelectOption = {
    backgroundColor: string,
    label: string,
}
export type PopperProps = {
    dispatch: (action: ActionType) => void;
    row: any;
    column: TableColumn;
    columns: any;
    note: NoteInfo;
} & BaseComponentProps;


export type TagsProps = {
} & BaseComponentProps;

export type CalendarProps = {
    column: TableColumn;
    cellProperties: Cell;
} & BaseComponentProps;