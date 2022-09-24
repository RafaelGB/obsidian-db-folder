import { RowDatabaseFields } from "cdm/DatabaseModel";
import { LocalSettings } from "cdm/SettingsModel";
import { InputType } from "helpers/Constants";
import { stringifyYaml } from "obsidian";
import { DataviewService } from "services/DataviewService";
export const parseFrontmatterFieldsToString = (databaseFields: RowDatabaseFields, deletedColumn?: string): string => {
    const frontmatterFields = databaseFields.frontmatter;
    delete frontmatterFields[deletedColumn];
    let array: string[] = [];
    if (Object.keys(frontmatterFields).length > 0) {
        const stringifiedFrontmatter = stringifyYaml(frontmatterFields);
        console.log(stringifiedFrontmatter);
        array = [`---`, stringifiedFrontmatter, `---`];
    }
    return array.join('\n');
}

export const parseInlineFieldsToString = (inlineFields: RowDatabaseFields): string => {
    const array: string[] = [];
    Object.keys(inlineFields.inline).forEach(key => {
        array.push(`${key}:: ${inlineFields.inline[key]}`);
    });
    return array.join('\n');
}

export function parseValuetoSanitizeYamlValue(value: string, localSettings: LocalSettings): string {
    return DataviewService.parseLiteral(value, InputType.MARKDOWN, localSettings).toString();
}