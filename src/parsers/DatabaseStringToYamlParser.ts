import { ParserError } from "errors/ParserError";
import { parseYaml } from "obsidian";

// Interface of handlers
import { YamlHandler, YamlHandlerResponse } from "cdm/MashallModel";

// Handlers of yaml parse
import { MarshallDatabaseInfoHandler } from 'parsers/handlers/marshall/MarshallDatabaseInfoHandler';
import { MarshallColumnsHandler } from "parsers/handlers/marshall/MarshallColumnsHandler";
import { MarshallConfigHandler } from "parsers/handlers/marshall/MarshallConfigHandler";
import { MarshallFiltersHandler } from "./handlers/marshall/MarshallFiltersHandler";

/**
 * EXPOSED METHOD
 ****************/
/**
 * Parse the string inside database file and return a object with the information
 */
const DatabaseStringToYamlParser = (yamlText: string): YamlHandlerResponse => {
    try {
        const yaml = parseYaml(yamlText);
        return validateYaml(yaml);
    } catch (e: any) {
        throw new ParserError("Error parsing yaml",
            { exception: [e] });
    }
}

/**
 * PRIVATE METHODS
 *****************/

/**
 * Validate yaml received from input using handlers of function getHandlers
 */
function validateYaml(yaml: any): YamlHandlerResponse {
    const handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }

    const response: YamlHandlerResponse = { yaml: yaml, errors: {} };
    return handlers[0]?.handle(response);
}


/**
 * Obtain all classes than extends from AbstractHandler
 */
function getHandlers(): YamlHandler[] {
    return [
        new MarshallDatabaseInfoHandler(),
        new MarshallColumnsHandler(),
        new MarshallConfigHandler(),
        new MarshallFiltersHandler()
    ];
}

// Export
export default DatabaseStringToYamlParser;