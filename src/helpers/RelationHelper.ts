import { SMarkdownPage } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { DatabaseCore } from "helpers/Constants";

/**
 * Search for all databases in the vault returning a Record of all databases
 * @param currentPath 
 * @returns 
 */
export function recordAllDatabases(currentPath?: string): Record<string, string> {
    const avaliableDDBB: Record<string, string> = {};
    DataviewService.getDataviewAPI().pages().where((page) => {
        const file = (page as SMarkdownPage).file;
        const optionalFilter = currentPath ? file.path !== currentPath : true;
        // Check if is a ddbb and is not the current one
        return page[DatabaseCore.FRONTMATTER_KEY] !== undefined && optionalFilter;
    }).forEach((page) => {
        const file = (page as SMarkdownPage).file;
        avaliableDDBB[file.path] = file.name;
    });
    return avaliableDDBB;
}