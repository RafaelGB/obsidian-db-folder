import { DatabaseView } from "DatabaseView";
import { RowSelectOption } from "cdm/ComponentsModel";

export type ColorPickerProps = {
    view: DatabaseView;
    options: RowSelectOption[];
    option: RowSelectOption;
    columnKey: string;
};