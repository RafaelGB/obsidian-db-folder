import { LocalSettings } from "cdm/SettingsModel";
import { Notice, TFolder } from "obsidian";
import { LOGGER } from "services/Logger";
import { DatabaseCore, DatabaseFrontmatterOptions, DATABASE_CONFIG, DEFAULT_SETTINGS, YAML_INDENT } from "helpers/Constants";

export async function generateNewDatabase(ddbbConfig: string, folder?: TFolder, ddbbName?: string, autoOpen = true) {
    const targetFolder = folder
        ?? app.fileManager.getNewFileParent(
            app.workspace.getActiveFile()?.path || ''
        );

    try {
        const ddbbContent = DatabaseFrontmatterOptions.BASIC
            .concat('\n')
            .concat(ddbbConfig)
            .concat('\n')
            .concat(DATABASE_CONFIG.END_CENTINEL);

        const database = await app.vault.create(
            targetFolder.path
                .concat("/")
                .concat(ddbbName ?? 'Untitled database')
                .concat(".md"),
            ddbbContent);
        // Open the new database file
        if (autoOpen) {
            await app.workspace.getMostRecentLeaf().setViewState({
                type: DatabaseCore.FRONTMATTER_KEY,
                state: { file: database.path },
            });
        }
    } catch (e) {
        LOGGER.error('Error creating database folder:', e);
        new Notice(`Error creating database folder: ${e}`, 5000);
    }
}

/**
 * Returns the default configuration for a database file.
 */
export function generateDbConfiguration(customLocalSettings: LocalSettings): string {
    const defaultConfig = [];
    defaultConfig.push("config:");
    Object.entries(DEFAULT_SETTINGS.local_settings).forEach(([key, value]) => {
        const defaultValue = customLocalSettings[key as keyof LocalSettings] !== undefined ? customLocalSettings[key as keyof LocalSettings] : value;
        defaultConfig.push(`${YAML_INDENT}${key}: ${defaultValue}`);
    });
    return defaultConfig.join('\n');
}