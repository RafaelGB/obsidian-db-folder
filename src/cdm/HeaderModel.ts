import { ColumnOrderState, Header, Table } from "@tanstack/react-table";
import { DatabaseHeaderProps, RowDataType, TableColumn } from "cdm/FolderModel";

export type HeaderMenuProps = {
    headerProps: DatabaseHeaderProps;
    propertyIcon: JSX.Element;
    expanded: boolean;
    setExpanded: (expanded: boolean) => void;
    created: boolean;
    referenceElement: HTMLDivElement;
    labelState: string;
    setLabelState: (label: string) => void;
};

export type TableHeaderProps = {
    table: Table<RowDataType>;
    header: Header<RowDataType, TableColumn>;
    reorderColumn: (draggedColumnId: string, targetColumnId: string, columnOrder: string[]) => ColumnOrderState;
    headerIndex: number;
};