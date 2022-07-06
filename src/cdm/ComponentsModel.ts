import NoteInfo from "services/NoteInfo";
import { BaseComponentProps } from "cdm/DatabaseModel";

export type RowSelectOption = {
    backgroundColor: string,
    label: string,
}
export type PopperProps = {
    dispatch: (action: any) => void;
    row: any;
    columns: any;
    note: NoteInfo;
} & BaseComponentProps;


export type TagsProps = {
    dispatch: (action: any) => void;
    cellProperties: any;
    columns: any;
} & BaseComponentProps;

export type CalendarProps = {
    cellProperties: any;
} & BaseComponentProps;