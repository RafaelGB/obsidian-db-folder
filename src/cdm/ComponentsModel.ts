import { ActionType, Cell } from "react-table";
import NoteInfo from "services/NoteInfo";
import { BaseComponentProps } from "cdm/DatabaseModel";

export type RowSelectOption = {
    backgroundColor: string,
    label: string,
}
export type PopperProps = {
    dispatch: (action: ActionType) => void;
    row: any;
    columns: any;
    note: NoteInfo;
} & BaseComponentProps;


export type TagsProps = {
    dispatch: (action: ActionType) => void;
    cellProperties: Cell;
    columns: any;
} & BaseComponentProps;

export type CalendarProps = {
    cellProperties: Cell;
} & BaseComponentProps;