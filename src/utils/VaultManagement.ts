import { App, TFile,TFolder } from "obsidian";

export function obtainCurrentFolder(app: App): string {
    const file = app.workspace.getActiveFile();
    // obtain folder to check
    if(!file){
        return null;
    }
    return file.path.split("/").slice(0,-1).join("/")+"/";
}

export function obtainTFilesFromTFolder(app: App, folderPath: string): any[] {
    let files: any[] = [];
    // TODO improve this filter?
    let id = 0;
    app.vault.getFiles().forEach(file => {
        if(file.path.startsWith(folderPath)){
            let aFile = {
                id: ++id,
                title: file.basename,
                director: "asfas",
                runtime: file.path
            }
            files.push(aFile);
        }
    });
    return files;
}