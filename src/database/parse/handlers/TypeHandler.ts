import {AbstractHandler} from 'database/parse/handlers/AbstractHandler';

/**
 * Types of database views
 */
 export enum DatabaseType {
    LIST = 'LIST',
    BOARD = 'BOARD'
}

export class TypeHandler extends AbstractHandler {
    public handle(yaml: any): string[] {
        if (!DatabaseType.hasOwnProperty(yaml.type)) {
            this.listOfErrors.push(`Type ${yaml.type} is not a valid DatabaseType`);
        }

        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(yaml);
        }
        return this.listOfErrors;
    }
}
