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


export function inlineRegexInFunctionOf(columnId: string) {
    const wrappererKey = `_\\*~\``;
    const conditionalInitWithField = `[${wrappererKey}]{0,2}${columnId}[${wrappererKey}]{0,2}[:]{2}`;
    const thenRegex = `(^${conditionalInitWithField})(.*$)`;
    const elseRegex = `(.*)([\\[(]{1})(${conditionalInitWithField})(.*)([)\\]]{1})(.*$)`;
    const finalExpression = `(?:(?=(^${conditionalInitWithField}))(${thenRegex})|(${elseRegex}))`;
    LOGGER.debug(`<=> inlineRegexInFunctionOf: ${finalExpression}`);
    return new RegExp(`${finalExpression}`, 'gm');
}