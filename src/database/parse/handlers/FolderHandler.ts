import {AbstractHandler} from 'database/parse/handlers/AbstractHandler';

export class FolderHandler extends AbstractHandler {
    public handle(yaml: any): boolean {
        if (!yaml.folder) {
            throw new Error("Folder is not defined");
        }
        return true;
    }
}