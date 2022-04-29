import { ActionType } from "react-table";
import NoteInfo from "services/NoteInfo";

export type RowSelectOption = {
    backgroundColor: string,
    label: string,
}
export type PopperProps = {
    initialValue: string;
    dispatch: (action: ActionType) => void;
    row: any;
    column: any;
    columns: any;
    note: NoteInfo;
};