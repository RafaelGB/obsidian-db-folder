import {App} from "obsidian";

export function obtainCurrentFolder(app: App): string {
    let file = app.workspace.getActiveFile();
    // obtain folder to check
    if(!file){
        return null;
    }
    return file.path.split("/").slice(0,-1).join("/")+"/";
}