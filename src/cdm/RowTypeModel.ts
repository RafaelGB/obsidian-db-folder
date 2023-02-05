import { Link } from "obsidian-dataview";
import { ColumnOption } from "cdm/ComponentsModel";
import NoteInfo from "services/NoteInfo";
import { ConfigColumn, RowDataType } from "cdm/FolderModel";
import { Row, Table } from "@tanstack/react-table";

export type RowType = number | string | boolean | Date | Link | ColumnOption[] | NoteInfo | ConfigColumn;

export type TableRowProps = {
    row: Row<RowDataType>,
    table: Table<RowDataType>
}