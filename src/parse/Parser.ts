import { parseYaml, App } from "obsidian";

// Interface of handlers
import { Handler } from "parse/handlers/AbstractHandler";
// Handlers of yaml parse
import { FolderHandler } from 'parse/handlers/FolderHandler';
import { TypeHandler } from 'parse/handlers/TypeHandler';
import { TitleHandler } from 'parse/handlers/TitleHandler';
import { DbFolderError } from "errors/AbstractError";
import { ParserError } from "errors/ParserError";
/**
 * PUBLIC METHODS
 ****************/
/**
 * Parse a string
 */
export function parseDatabase(yamlText: string, app: App): any {
    let yaml;

    yaml = parseYaml(yamlText);
    let errors = validateYaml(yaml, app);
    if (errors.length > 0) {
        throw new DbFolderError(new ParserError("Error parsing database", errors));
    }
    return yaml;

}

/**
 * PRIVATE METHODS
 *****************/


/**
 * Validate yaml received from input using handlers of function getHandlers
 */
function validateYaml(yaml: any, app: App): [string, string][] {
    let handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }
    let errors = handlers[0].handle(yaml, app);
    return errors;
}



/**
 * Obtain all classes than extends from AbstractHandler
 */
function getHandlers(): Handler[] {
    return [
        new TypeHandler(),
        new FolderHandler(),
        new TitleHandler()
    ];
}