import { RowType } from "cdm/RowTypeModel"
import { FilterSettings, LocalSettings } from "cdm/SettingsModel";
import { Literal } from "obsidian-dataview/lib/data-model/value";
import { TableOptions } from "@tanstack/react-table";
import { BaseColumn, RowDataType } from "cdm/FolderModel";
import { DateTime, SMarkdownPage, STask } from "obsidian-dataview";

/** database column */
export interface DatabaseColumn extends BaseColumn {
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
    filters: FilterSettings;
}

export type RowDatabaseFields = {
    frontmatter: Record<string, Literal>;
    inline: Record<string, Literal>;
}

export type OptionSelect = {
    label: string;
    backgroundColor: string;
}

export type SortedType = {
    id: string;
    desc: boolean;
}

export type MetadataColumnsModel = {
    [key: string]: DatabaseColumn
}

export type TableOptionsResponse = {
    options: TableOptions<RowDataType>;
}

export type NoteInfoPage = Omit<SMarkdownPage, "file"> & {
    file:
    {
        link: {
            fileName: () => string, path: string
        },
        path: string,
        ctime: DateTime,
        mtime: DateTime,
        tasks?: STask[]
    }
};