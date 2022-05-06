import { parseYaml } from "obsidian";
export const parseFrontmatterFieldsToString = (frontmatterFields: Record<string, any>, original?: string, deletedColumn?: string): string => {
    const match = original.match(/^---\s+([\w\W]+?)\s+---/);

    const array: string[] = [];
    array.push(`---`);
    Object.keys(frontmatterFields).forEach(key => {
        array.push(`${key}: ${frontmatterFields[key]}`);
    });
    if (match) {
        const frontmatterRaw = match[1];
        const yaml = parseYaml(frontmatterRaw);
        Object.keys(yaml).forEach(key => {
            if (!frontmatterFields[key] && key !== deletedColumn) {
                array.push(`${key}: ${yaml[key]}`);
            }
        });
    }
    array.push(`---`);
    return array.join('\n');
}