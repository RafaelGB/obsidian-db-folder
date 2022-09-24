import { Notice } from "obsidian";
import { LOGGER } from "services/Logger";

/**
 * REPOSITORY OF POSSIBLE ERRORS IN FUNCTION OF THE AMBIT
 */
type DBError = {
    error: string;
    solution: string;
}

type DBErrorTypeEnum = {
    [key: string]: DBError;
}
export function showDBError(err: DBError, exception: Error) {
    LOGGER.error(`${err.error}. See ${err.solution}`, exception);
    new Notice(`${err.error}. See ${err.solution}`, 6000);
}


export const EditionError: DBErrorTypeEnum = Object.freeze({
    YamlRead: {
        error: `Error reading yaml file`,
        solution: `https://rafaelgb.github.io/obsidian-db-folder/faq/#possible-edition-issues-while-you-are-saving-a-cell-change`,
    }
});

export const AutomationError: DBErrorTypeEnum = Object.freeze({
    LoadFormulas: {
        error: `Error loading formulas`,
        solution: `check your js files code`
    },
});