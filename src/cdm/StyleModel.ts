import { RowSelectOption } from "cdm/ComponentsModel";
import { ColumnSettingsModal } from "components/modals/columnSettings/ColumnSettingsModal";

export type ColorPickerProps = {
    modal: ColumnSettingsModal;
    options: RowSelectOption[];
    option: RowSelectOption;
    columnKey: string;
};