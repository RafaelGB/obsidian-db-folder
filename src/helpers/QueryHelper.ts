import { TableColumn } from "cdm/FolderModel";
import { DatabaseCore } from "helpers/Constants";
import { LOGGER } from "services/Logger";

export function generateDataviewTableQuery(columns: TableColumn[], fromQuery: string): string {
    LOGGER.info('generateDataviewTableQuery');
    const query = `TABLE ${columns
        .filter((col) => !col.isMetadata)
        .map((col) => `${col.key}`)
        .join(",")},${DatabaseCore.DATAVIEW_FILE},${DatabaseCore.FRONTMATTER_KEY} ${fromQuery}`;
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