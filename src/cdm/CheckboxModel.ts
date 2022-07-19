import { TableColumn, TableDataType } from "cdm/FolderModel";
import { CellProps } from "cdm/CellModel";

export type CheckboxProps = {
    intialState: TableDataType;
    column: TableColumn;
    cellProperties: CellProps;
};