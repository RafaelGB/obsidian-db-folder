import { ActionType } from "react-table";
import NoteInfo from "services/NoteInfo";
import { TableDataType } from "cdm/FolderModel";

export type RowSelectOption = {
    backgroundColor: string,
    label: string,
}
export type PopperProps = {
    dispatch: (action: ActionType) => void;
    row: any;
    column: any;
    columns: any;
    note: NoteInfo;
    state: TableDataType;
};