import { TableColumn } from "cdm/FolderModel";
import { CellProps } from "cdm/CellModel";
import { BaseComponentProps } from "cdm/DatabaseModel";

export type CheckboxProps = {
    cellProperties: CellProps;
} & BaseComponentProps;