import { RowType } from "cdm/RowTypeModel"
import { Literal } from "obsidian-dataview/lib/data-model/value";
import { Cell } from "react-table";
import { LocalSettings } from "Settings"
import { BaseColumn, TableColumn, TableDataType } from "cdm/FolderModel";
import { RowSelectOption } from "cdm/RowSelectModel";

/** database column */
export interface DatabaseColumn extends BaseColumn {
    input: string;
    options?: RowSelectOption[];
    [key: string]: RowType;
}

/** database yaml */
export interface DatabaseYaml {
    /** database name */
    name: string;
    /** database description */
    description: string;
    /** database columns */
    columns: Record<string, DatabaseColumn>;
    /** database local configuration */
    config: LocalSettings;
    /** dataview filters */
    filters: FilterCondition[];
}

export type RowDatabaseFields = {
    frontmatter: Record<string, Literal>;
    inline: Record<string, Literal>;
}

export type FilterCondition = {
    field: string;
    operator: string;
    value?: any;
}

export type OptionSelect = {
    label: string;
    backgroundColor: string;
}

export type CalendarProps = {
    intialState: TableDataType;
    column: TableColumn;
    cellProperties: Cell;
};

export type SortedType = {
    id: string;
    desc: boolean;
}