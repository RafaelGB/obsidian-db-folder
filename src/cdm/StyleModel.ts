import { RowSelectOption } from "cdm/ComponentsModel";
import { ColumnSettingsModal } from "components/modals/columnSettings/ColumnSettingsModal";

type BaseStyleProps = {
    modal: ColumnSettingsModal;
    columnKey: string;
};

export type ColorPickerProps = {
    options: RowSelectOption[];
    option: RowSelectOption;
} & BaseStyleProps;

export type TextAlignmentProps = {

} & BaseStyleProps;