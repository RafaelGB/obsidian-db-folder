import { parseYaml } from "obsidian";
import { DatabaseType } from 'database/Database';
/**
 * Parse a string
 */
export function parseDatabase(yamlText: string): any {
    let yaml;
    try {
        yaml = parseYaml(yamlText);
        validateYaml(yaml);
        return yaml;
    } catch (err) {
        let errorMessage = "Error parsing YAML";
        console.error(err);
        return "error";
    }
}
/**
 * Validate yaml received from input if contains a correct DatabaseType and an existing folder
 */
function validateYaml(yaml: any): void {
    validateType(yaml.type);
    validateFolder(yaml.folder);
}

/**
 * check if string received is a valid DatabaseType
 * @param type 
 */
function validateType(type: string): void {
    if (!DatabaseType.hasOwnProperty(type)) {
        throw new Error(`Type ${type} is not a valid DatabaseType`);
    }
}
function validateFolder(folder: string): void {
    if (!folder) {
        throw new Error("Folder is not defined");
    }
}