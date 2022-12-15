import { ColumnSettingsModal } from "components/modals/columnSettings/ColumnSettingsModal";

type BaseStyleProps = {
    modal: ColumnSettingsModal;
    columnId: string;
};

export type TextAlignmentProps = {
    currentAlignment: string;
} & BaseStyleProps;