import { RowDatabaseFields } from "cdm/DatabaseModel";
import { parseYaml } from "obsidian";
export const parseFrontmatterFieldsToString = (databaseFields: RowDatabaseFields, original: string, deletedColumn?: string): string => {
    const frontmatterFields = databaseFields.frontmatter;
    const inlineFields = databaseFields.inline;
    const array: string[] = [];
    array.push(`---`);
    Object.keys(frontmatterFields).forEach(key => {
        array.push(`${key}: ${frontmatterFields[key]}`);
    });
    const match = original.match(/^---\s+([\w\W]+?)\s+---/);
    if (match) {
        const frontmatterRaw = match[1];
        const yaml = parseYaml(frontmatterRaw);
        Object.keys(yaml)
            .filter(fkey =>
                // Filter out duplicates and deleted columns
                !Object.prototype.hasOwnProperty.call(inlineFields, fkey)
                && !Object.prototype.hasOwnProperty.call(frontmatterFields, fkey)
                && fkey !== deletedColumn)
            .forEach(key => {
                // add frontmatter fields that are not specified as database fields
                array.push(`${key}: ${yaml[key] ?? ''}`);
            });
    }
    array.push(`---`);
    return array.join('\n');
}

export const parseInlineFieldsToString = (inlineFields: RowDatabaseFields): string => {
    const array: string[] = [];
    Object.keys(inlineFields.inline).forEach(key => {
        array.push(`${key}:: ${inlineFields.inline[key]}`);
    });
    return array.join('\n');
}