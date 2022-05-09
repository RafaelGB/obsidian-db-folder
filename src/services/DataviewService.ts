import { Notice } from "obsidian";
import { getAPI, isPluginEnabled } from "obsidian-dataview";
import { DvAPIInterface } from "obsidian-dataview/lib/typings/api";

/**
 * Check if dataview plugin is installed
 * @returns true if installed, false otherwise
 * @throws Error if plugin is not installed
 */
export function getDataviewAPI(): DvAPIInterface {
    if (isPluginEnabled(app)) {
        return getAPI(app);
    } else {
        new Notice(`Dataview plugin is not installed. Please install it to load Databases.`);
        throw new Error('Dataview plugin is not installed');
    }
}