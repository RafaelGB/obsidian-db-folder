import { DatabaseView } from "DatabaseView";
import { RowSelectOption } from "./ComponentsModel";

export type ColorPickerProps = {
    view: DatabaseView;
    options: RowSelectOption[];
    option: RowSelectOption;
    columnKey: string;
};