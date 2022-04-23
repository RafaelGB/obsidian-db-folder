import { parseYaml } from "obsidian";

// Interface of handlers
import { YamlHandler } from "parsers/embedYamlHandlers/AbstractYamlPropertyHandler";
// Handlers of yaml parse
import { FolderHandler } from 'parsers/embedYamlHandlers/FolderHandler';
import { TypeHandler } from 'parsers/embedYamlHandlers/TypeHandler';
import { TitleHandler } from 'parsers/embedYamlHandlers/TitleHandler';
import { DbFolderError } from "errors/AbstractError";
import { ParserError } from "errors/ParserError";
import { DatabaseYaml } from "cdm/DatabaseModel";
/**
 * PUBLIC METHODS
 ****************/
/**
 * Parse a string
 */
const DatabaseYamlParser = (yamlText: string): DatabaseYaml => {
    const yaml = parseYaml(yamlText);
    const errors = validateYaml(yaml);
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
function validateYaml(yaml: any): [string, string][] {
    const handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }
    return handlers[0].handle(yaml);
}



/**
 * Obtain all classes than extends from AbstractHandler
 */
function getHandlers(): YamlHandler[] {
    return [
        new TypeHandler(),
        new FolderHandler(),
        new TitleHandler()
    ];
}

// Export
export default DatabaseYamlParser;