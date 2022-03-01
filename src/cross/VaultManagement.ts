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
    console.log("=> adapterTFilesToRows.  folderPath:",folderPath);
    const rows: TableRows = [];
    let id = 0;
    await Promise.all(app.vault.getFiles().map(async (file) => {
        if (file.path.startsWith(folderPath)) {
            let properties = await MetaInfoService.getInstance(app).getPropertiesInFile(file);
            /** Mandatory fields */
            const aFile: TableRow = {
                id: ++id,
                title: `[[${file.basename}]]`
            };
            /** Rest of fields */
            properties.forEach(property => {
                aFile[property.key] = property.content;
            });
            rows.push(aFile);
        }
    }));
    console.log("<= adapterTFilesToRows.  rows:",rows);
    return rows;
}