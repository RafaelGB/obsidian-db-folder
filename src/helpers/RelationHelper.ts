import { SMarkdownPage } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { DatabaseCore, DEFAULT_SETTINGS } from "helpers/Constants";
import { resolve_tfile } from "helpers/FileManagement";
import DatabaseInfo from "services/DatabaseInfo";
import { adapterTFilesToRows } from "helpers/VaultManagement";
import { LocalSettings } from "cdm/SettingsModel";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { obtainColumnsFromFolder, obtainColumnsFromRows } from "components/Columns";
import { TFile } from "obsidian";

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
type RelationInfo = {
    recordRows: Record<string, string>;
    ddbbFile: TFile,
    ddbbInfo: DatabaseInfo,
    relatedColumns: TableColumn[],
    relatedRows: RowDataType[]
}

export async function obtainInfoFromRelation(ddbbPath: string): Promise<RelationInfo> {
    const recordRows: Record<string, string> = {};
    const ddbbFile = resolve_tfile(ddbbPath);
    const ddbbInfo = await new DatabaseInfo(ddbbFile, DEFAULT_SETTINGS.local_settings).build();
    const relatedColumns = await obtainColumnsFromFolder(ddbbInfo.yaml.columns);
    const relatedRows = await adapterTFilesToRows(ddbbFile, relatedColumns, ddbbInfo.yaml.config, ddbbInfo.yaml.filters);
    relatedRows.forEach((row) => {
        const file = row.__note__.getFile()
        recordRows[file.path] = file.name;
    });
    return { recordRows, ddbbFile, ddbbInfo, relatedColumns, relatedRows }
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