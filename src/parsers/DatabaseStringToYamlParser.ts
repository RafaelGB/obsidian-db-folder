import { parseYaml } from "obsidian";

// Interface of handlers
import { YamlHandler,YamlHandlerResponse } from "parsers/embedYamlHandlers/AbstractYamlPropertyHandler";
// Handlers of yaml parse
import { BaseInfoHandler } from 'parsers/embedYamlHandlers/BaseInfoHandler';
import { DbFolderError } from "errors/AbstractError";
import { ParserError } from "errors/ParserError";
import { DatabaseYaml } from "cdm/DatabaseModel";
/**
 * PUBLIC METHODS
 ****************/
/**
 * Parse a string
 */
const DatabaseStringToYamlParser = (yamlText: string): DatabaseYaml => {
    const yaml = parseYaml(yamlText);
    const response = validateYaml(yaml);
    if (Object.keys(response.errors).length > 0) {
        throw new DbFolderError(new ParserError("Error parsing database", response.errors));
    }
    return response.yaml;

}

/**
 * PRIVATE METHODS
 *****************/


/**
 * Validate yaml received from input using handlers of function getHandlers
 */
function validateYaml(yaml: any): YamlHandlerResponse{
    const handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }
    
    const response: YamlHandlerResponse={yaml: yaml, errors: {}};
    return handlers[0].handle(response);
}



/**
 * Obtain all classes than extends from AbstractHandler
 */
function getHandlers(): YamlHandler[] {
    return [
        new BaseInfoHandler()
    ];
}

// Export
export default DatabaseStringToYamlParser;