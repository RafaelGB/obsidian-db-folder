import { App, parseLinktext } from "obsidian";
import { TableRows,TableRow } from 'cdm/FolderModel';
import { MetaInfoService } from 'services/MetaInfoService';
import { getAPI } from "obsidian-dataview"

export async function adapterTFilesToRows(app: App, folderPath: string): Promise<TableRows> {
    console.log("=> adapterTFilesToRows.  folderPath:",folderPath);
    const rows: TableRows = [];
    let id = 0;
    await Promise.all(app.vault.getFiles().map(async (file) => {
        if (file.path.startsWith(folderPath)) {
            // TODO dependency injection of service on future
            const properties = await MetaInfoService.getInstance(app).getPropertiesInFile(file);
            const filelink = getAPI(app).fileLink(file.path);
            /** Mandatory fields */
            const aFile: TableRow = {
                id: ++id,
                title: `${filelink.markdown()}`
            };
            /** Optional fields */
            properties.forEach(property => {
                aFile[property.key] = property.content;
            });
            rows.push(aFile);
        }
    }));
    console.log("<= adapterTFilesToRows.  rows:",rows);
    return rows;
}