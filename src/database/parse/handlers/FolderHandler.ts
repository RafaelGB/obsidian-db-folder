import {AbstractHandler} from 'database/parse/handlers/AbstractHandler';

export class FolderHandler extends AbstractHandler {
    public handle(yaml: any): string[] {
        if (!yaml.folder) {
            this.listOfErrors.push('Folder is not defined');
        }

        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(yaml);
        }
        return this.listOfErrors;
    }
}