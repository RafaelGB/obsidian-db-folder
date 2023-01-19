import { SMarkdownPage } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { DatabaseCore } from "helpers/Constants";
import { resolve_tfile } from "helpers/FileManagement";
import DatabaseInfo from "services/DatabaseInfo";
import { sourceDataviewPages } from "helpers/VaultManagement";
import { LocalSettings } from "cdm/SettingsModel";
import { TableColumn } from "cdm/FolderModel";
import { obtainColumnsFromRows } from "components/Columns";

/**
 * Search for all databases in the vault returning a Record of all databases
 * @param currentPath 
 * @returns 
 */
export function recordAllDatabases(): Record<string, string> {
    const avaliableDDBB: Record<string, string> = {};
    DataviewService.getDataviewAPI().pages().where((page) => {
        return page[DatabaseCore.FRONTMATTER_KEY] !== undefined;
    }).forEach((page) => {
        const file = (page as SMarkdownPage).file;
        avaliableDDBB[file.path] = file.name;
    });
    return avaliableDDBB;
}

export async function recordRowsFromRelation(ddbbPath: string, ddbbConfig: LocalSettings, columns?: TableColumn[]): Promise<Record<string, string>> {
    const relationRows: Record<string, string> = {};
    const ddbbFile = resolve_tfile(ddbbPath);
    const ddbbInfo = await new DatabaseInfo(ddbbFile, ddbbConfig).build();

    const ddbbRows = await sourceDataviewPages(ddbbInfo.yaml.config, ddbbFile.parent.path, columns);
    ddbbRows
        .filter((page) => !page[DatabaseCore.FRONTMATTER_KEY])
        .forEach((page) => {
            const file = (page as SMarkdownPage).file;
            relationRows[file.path] = file.name;
        });
    return relationRows;
}

export async function recordFieldsFromRelation(ddbbPath: string, ddbbConfig: LocalSettings, columns?: TableColumn[]): Promise<Record<string, string>> {
    const relationFields: Record<string, string> = {};
    const ddbbFile = resolve_tfile(ddbbPath);
    const ddbbInfo = await new DatabaseInfo(ddbbFile, ddbbConfig).build();
    const fields = await obtainColumnsFromRows(
        ddbbFile.parent.path,
        ddbbInfo.yaml.config,
        ddbbInfo.yaml.filters,
        columns);
    // get unique fields from all rows
    fields.forEach((field) => {
        // iterate over all fields in the row
        relationFields[field] = field;
    });
    return relationFields;
}