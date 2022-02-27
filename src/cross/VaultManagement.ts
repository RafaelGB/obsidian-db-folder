import { App } from "obsidian";
import { TableRows } from 'cdm/FolderModel';
export function obtainCurrentFolder(app: App): string {
    const file = app.workspace.getActiveFile();
    // obtain folder to check
    if(!file){
        return null;
    }
    return file.path.split("/").slice(0,-1).join("/")+"/";
}

export function adapterTFilesToRows(app: App, folderPath: string): TableRows {
    const rows: TableRows = [];
    // TODO improve this filter?
    let id = 0;
    app.vault.getFiles().forEach(file => {
        if(file.path.startsWith(folderPath)){
            const aFile = {
                id: ++id,
                title: `[[${file.basename}]]`
            }
            rows.push(aFile);
        }
    });
    return rows;
}