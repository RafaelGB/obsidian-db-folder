import { DatabaseView } from "DatabaseView";
import { RowSelectOption } from "./ComponentsModel";

export type ColumnWidthState = {
    widthRecord: Record<string, number>
}


export type ColorPickerProps = {
    view: DatabaseView;
    options: RowSelectOption[];
    option: RowSelectOption;
    columnKey: string;
};