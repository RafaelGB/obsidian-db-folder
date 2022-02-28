import { App } from "obsidian";
import { TableRows,TableRow } from 'cdm/FolderModel';
import { MetaInfoService } from 'services/MetaInfoService';

export function obtainCurrentFolder(app: App): string {
    const file = app.workspace.getActiveFile();
    // obtain folder to check
    if(!file){
        return null;
    }
    return file.path.split("/").slice(0,-1).join("/")+"/";
}

export async function adapterTFilesToRows(app: App, folderPath: string): Promise<TableRows> {
    const rows: TableRows = [];
    // TODO improve this filter?
    let id = 0;
    app.vault.getFiles().forEach(async file => {
        if(file.path.startsWith(folderPath)){
            let properties = await MetaInfoService.getInstance(app).getPropertiesInFile(file);
            
            const aFile:TableRow = {
                id: ++id,
                title: `[[${file.basename}]]`
            }
            properties.forEach(property => {
                aFile[property.key] = property.content;
            });
            rows.push(aFile);
        }
    });
    return rows;
}