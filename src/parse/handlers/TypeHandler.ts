import {AbstractHandler} from 'parse/handlers/AbstractHandler';
import { App } from "obsidian";

/**
 * Types of database views
 */
 export enum DatabaseType {
    LIST = 'LIST',
    BOARD = 'BOARD'
}

export class TypeHandler extends AbstractHandler {
    handlerName: string = 'type';
    public handle(yaml: any, app: App): [string, string][] {

        if (!yaml.type) {
            // Default type is LIST if not specified
            yaml.type=DatabaseType.LIST;
        }

        if (!DatabaseType.hasOwnProperty(yaml.type)) {
            this.addError(`Type ${yaml.type} is not a valid DatabaseType`);
            // handle is ended if type is not included in DatabaseType
            return this.listOfErrors;   
        }

        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(yaml,app);
        }
        return this.listOfErrors;
    }
}
