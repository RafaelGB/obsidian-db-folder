import { parseYaml } from "obsidian";

// Interface of handlers
import { YamlHandler,YamlHandlerResponse } from "parsers/handlers/AbstractYamlPropertyHandler";
// Handlers of yaml parse
import { BaseInfoHandler } from 'parsers/handlers/BaseInfoHandler';
import { ColumnsHandler } from "parsers/handlers/ColumnsHandler";

/**
 * PUBLIC METHODS
 ****************/
/**
 * Parse a string
 */
const DatabaseStringToYamlParser = (yamlText: string): YamlHandlerResponse => {
    const yaml = parseYaml(yamlText);
    return validateYaml(yaml);
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
        new BaseInfoHandler(),
        new ColumnsHandler()
    ];
}

// Export
export default DatabaseStringToYamlParser;