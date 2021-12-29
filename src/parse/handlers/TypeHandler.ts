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
    public handle(yaml: any, app: App): string[] {

        if (!yaml.type) {
            this.listOfErrors.push('Type is not defined');
            // handle is ended if type is not defined
            return this.listOfErrors;
        }

        if (!DatabaseType.hasOwnProperty(yaml.type)) {
            this.listOfErrors.push(`Type ${yaml.type} is not a valid DatabaseType`);
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
