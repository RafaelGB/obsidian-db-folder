import { RowDatabaseFields } from "cdm/DatabaseModel";
import { parseYaml } from "obsidian";
export const parseFrontmatterFieldsToString = (databaseFields: RowDatabaseFields, original?: string, deletedColumn?: string): string => {
    const frontmatterFields = databaseFields.frontmatter;
    const inlineFields = databaseFields.inline;
    const array: string[] = [];
    array.push(`---`);
    Object.keys(frontmatterFields).forEach(key => {
        array.push(`${key}: ${frontmatterFields[key]}`);
    });
    if (original !== undefined) {
        const match = original.match(/^---\s+([\w\W]+?)\s+---/);
        if (match) {
            const frontmatterRaw = match[1];
            const yaml = parseYaml(frontmatterRaw);
            Object.keys(yaml).forEach(key => {
                // add frontmatter fields that are not specified as database fields
                // check if frontmatter field is inside inline fields
                if (!inlineFields.hasOwnProperty(key) && !frontmatterFields[key] && key !== deletedColumn) {
                    array.push(`${key}: ${yaml[key] ?? ''}`);
                }
            });
        }
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