import { TableColumn } from "cdm/FolderModel";
import { DatabaseCore } from "helpers/Constants";
import { LOGGER } from "services/Logger";

export function generateDataviewTableQuery(columns: TableColumn[], fromQuery: string): string {
    LOGGER.info('generateDataviewTableQuery');
    // User columns
    const keyArrays = columns
        .filter((col) => !col.isMetadata)
        .map((col) => `${col.key}`);
    // Plugin special columns
    keyArrays.push(DatabaseCore.DATAVIEW_FILE);
    keyArrays.push(DatabaseCore.FRONTMATTER_KEY);

    const query = `TABLE ${keyArrays.join(',')} ${fromQuery}`;
    LOGGER.info(`DV query of the source: ${query}`);
    return query;
}