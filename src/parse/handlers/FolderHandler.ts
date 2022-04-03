import { AbstractHandler } from 'parse/handlers/AbstractHandler';
import { App, normalizePath } from "obsidian";
export class FolderHandler extends AbstractHandler {
    handlerName: string = 'folder';
    public handle(yaml: any, app: App): [string, string][] {
        if (!yaml.folder) {
            this.addError('Folder name is not defined');
            // handle is ended if there is no folder name
            return this.listOfErrors;
        }

        if (!this.checkIfFolderExist(yaml, app)) {
            // handle is ended if the folder does not exist
            return this.listOfErrors;
        }
        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(yaml, app);
        }
        return this.listOfErrors;
    }

    /**
     * In function of current path file and folder name, check if the folder exists
     * 
     * I.E.: path=vault/folder/file.md, folder=newFolder
     * check if vault/folder/newFolder exists
     * @param path
     * @param folderName 
     */
    checkIfFolderExist(yaml: any, app: App): boolean {
        // check if folder exists
        let folder_str = normalizePath(yaml.folder);
        const folder = app.vault.getAbstractFileByPath(folder_str);
        if (!folder) {
            this.addError(`Folder ${yaml.folder} does not exist`);
            return false;
        }
        return true;
    }
}