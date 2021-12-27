import {AbstractHandler} from 'database/parse/handlers/AbstractHandler';

/**
 * Types of database views
 */
 export enum DatabaseType {
    LIST = 'LIST',
    BOARD = 'BOARD'
}

export class TypeHandler extends AbstractHandler {
    public handle(yaml: any): boolean {
        if (!DatabaseType.hasOwnProperty(yaml.type)) {
            throw new Error(`Type ${yaml.type} is not a valid DatabaseType`);
        }
        return true;
    }
}
