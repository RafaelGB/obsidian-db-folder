import { DatabaseView } from "DatabaseView";
import { ColorResult } from "react-color";
import { RowSelectOption } from "./RowSelectModel";

export type ColumnWidthState = {
    widthRecord: Record<string, number>
}

export type HeaderContextType = {
    columnWidthState: ColumnWidthState,
    setColumnWidthState: (a: ColumnWidthState) => void
}

export type ColorPickerProps = {
    view: DatabaseView;
    options: RowSelectOption[];
    option: RowSelectOption;
    columnKey: string;
};