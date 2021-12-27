import {AbstractHandler} from 'database/parse/handlers/AbstractHandler';
import { App,normalizePath } from "obsidian";
import path from 'path/posix';

export class FolderHandler extends AbstractHandler {
    public handle(yaml: any, app: App): string[] {
        if (!yaml.folder) {
            this.listOfErrors.push('Folder name is not defined');
            // handle is ended if there is no folder name
            return this.listOfErrors;
        }
        
        if(!this.checkIfFolderExist(yaml,app)){
            // handle is ended if the folder does not exist
            return this.listOfErrors;
        }
        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(yaml,app);
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
        let file = app.workspace.getActiveFile();
        // obtain folder to check
        console.log(file.path.split);
        console.log(file.path.split("/"));
        let folderToCheck = file.path.split("/").slice(0,-1).join("/")+yaml.folder;
        console.log(folderToCheck);
        // check if folder exists
        let folder_str = normalizePath(folderToCheck);
        const folder = app.vault.getAbstractFileByPath(folder_str);
        if(!folder){
            this.listOfErrors.push(`Folder ${folderToCheck} does not exist`);
            return false;
        }
        return true;
    }
}