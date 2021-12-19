import { parseYaml } from "obsidian";

/**
 * Parse a string
 */
export function parseDatabase(yamlText: string): string {
    let yaml;
    try {
        yaml = parseYaml(yamlText);
        console.log(yaml);
        return "lisk";
    } catch (err) {
        let errorMessage = "Error parsing YAML";
        console.error(err);
        return "error";
    }
}