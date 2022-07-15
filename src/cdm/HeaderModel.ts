import { ColumnResizeMode, Header, Table } from "@tanstack/react-table";
import { DatabaseHeaderProps, RowDataType, TableColumn } from "cdm/FolderModel";
import { ColumnWidthState } from "cdm/StyleModel";

export type HeaderMenuProps = {
    headerProps: DatabaseHeaderProps;
    setSortBy: any;
    propertyIcon: any;
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
    created: boolean;
    referenceElement: any;
    labelState: string;
    setLabelState: (label: string) => void;
};

export type HeaderTableProps = {
    table: Table<RowDataType>;
    header: Header<RowDataType, TableColumn>;
    headerIndex: number;
    columnResizeMode: ColumnResizeMode;
    columnsWidthState: ColumnWidthState;
    setColumnsWidthState: React.Dispatch<React.SetStateAction<ColumnWidthState>>;
};