import { FilterFn, Row } from "@tanstack/react-table"
import { RowDataType } from "cdm/FolderModel"
import { LocalSettings } from "cdm/SettingsModel";
import { InputType } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";

export const globalDatabaseFilterFn: (ddbbConfig: LocalSettings) => FilterFn<RowDataType> = (ddbbConfig: LocalSettings) => (
    row: Row<RowDataType>,
    columnId: string,
    filterValue: string
) => {
    const value = row.getValue<Literal>(columnId);
    if (value === undefined) {
        return false;
    }
    const sanitized = DataviewService.parseLiteral(value, InputType.MARKDOWN, ddbbConfig, true).toString().toLowerCase();
    filterValue = filterValue.toLowerCase();
    return sanitized.includes(filterValue) || searchRegex(sanitized, filterValue);
}

function searchRegex(sanitized: string, filterValue: string): boolean {
    try {
        const regex = new RegExp(filterValue);
        return regex.test(sanitized);
    } catch (e) {
        return false;
    }
}