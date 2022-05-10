import { ParserError } from "errors/ParserError";
import { parseYaml } from "obsidian";

// Interface of handlers
import { YamlHandler, YamlHandlerResponse } from "cdm/MashallModel";

// Handlers of yaml parse
import { BaseInfoHandler } from 'parsers/handlers/marshall/MarshallDatabaseInfoHandler';
import { ColumnsHandler } from "parsers/handlers/marshall/MarshallColumnsHandler";
import { ConfigHandler } from "parsers/handlers/marshall/MarshallConfigHandler";
import { FiltersHandler } from "./handlers/marshall/MarshallFiltersHandler";

/**
 * PUBLIC METHODS
 ****************/
/**
 * Parse a string
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
    return handlers[0].handle(response);
}



/**
 * Obtain all classes than extends from AbstractHandler
 */
function getHandlers(): YamlHandler[] {
    return [
        new BaseInfoHandler(),
        new ColumnsHandler(),
        new ConfigHandler(),
        new FiltersHandler()
    ];
}

// Export
export default DatabaseStringToYamlParser;