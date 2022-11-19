import { FilterFn, Row } from "@tanstack/react-table"
import { RowDataType } from "cdm/FolderModel"
import { LocalSettings } from "cdm/SettingsModel";
import { InputType } from "helpers/Constants";
import { Literal } from "obsidian-dataview";
import { LOGGER } from "services/Logger";
import { ParseService } from "services/ParseService";

export const globalDatabaseFilterFn: (ddbbConfig: LocalSettings) => FilterFn<RowDataType> = (ddbbConfig: LocalSettings) => (
    row: Row<RowDataType>,
    columnId: string,
    filterValue: string
) => {
    try {
        const value = row.getValue<Literal>(columnId);
        if (value === undefined) {
            return false;
        }
        const sanitized = ParseService.parseLiteral(value, InputType.MARKDOWN, ddbbConfig, true).toString().toLowerCase();

        filterValue = filterValue.toString().toLowerCase();
        return sanitized.includes(filterValue) || searchRegex(sanitized, filterValue);
    } catch (e) {
        LOGGER.error(`Error while searching with globalDatabaseFilterFn: ${e}`);
        return false;
    }
}

function searchRegex(sanitized: string, filterValue: string): boolean {
    try {
        const regex = new RegExp(filterValue);
        return regex.test(sanitized);
    } catch (e) {
        return false;
    }
}


const customSortingfns = {};

export default customSortingfns;