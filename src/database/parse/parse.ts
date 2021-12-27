import { parseYaml } from "obsidian";

// Interface of handlers
import { Handler } from "database/parse/handlers/AbstractHandler";
// Handlers of yaml parse
import {FolderHandler} from 'database/parse/handlers/FolderHandler';
import {TypeHandler} from 'database/parse/handlers/TypeHandler';
/**
 * PUBLIC METHODS
 ****************/

/**
 * Parse a string
 */
export function parseDatabase(yamlText: string): any {
    let yaml;
    try {
        yaml = parseYaml(yamlText);
        // TODO check if yaml is valid, throw error if not
        validateYaml(yaml);
        return yaml;
    } catch (err) {
        let errorMessage = "Error parsing YAML: ";
        console.error(errorMessage+err);
        return "error";
    }
}

/**
 * PRIVATE METHODS
 *****************/


/**
 * Validate yaml received from input using handlers of function getHandlers
 */
function validateYaml(yaml: any): boolean {
    let handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i-1].setNext(handlers[i]);
        i++;
    }
    // TODO create custom errors
    let errors = handlers[0].handle(yaml);
    if (errors.length > 0) {
        console.error("Errors found: ");
        errors.forEach(error => {
            console.error(error);
        });
        return false;
    }   
    return true;
}



/**
 * Obtain all classes than extends from AbstractHandler
 */
function getHandlers(): Handler[] {
    return [
        new TypeHandler(),
        new FolderHandler()
    ];
}