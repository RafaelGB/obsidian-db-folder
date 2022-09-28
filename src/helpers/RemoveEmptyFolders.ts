import { LocalSettings } from "cdm/SettingsModel";
import { Notice } from "obsidian";

async function removeEmptyFoldersRecursively(directory: string, deletedFolders: Set<string> ) {
    let list = await app.vault.adapter.list(directory);
    for (const folder of list.folders){
        deletedFolders = (await removeEmptyFoldersRecursively((folder), deletedFolders))
    }
    
    list = await app.vault.adapter.list(directory);
    if (list.files.length === 0 && list.folders.length === 0) {
       
        await app.vault.adapter.rmdir(directory, false );
        deletedFolders.add(directory);
        console.log(`Removed empty folder: ${directory}`);
    }

    return deletedFolders
}

export async function removeEmptyFolders(directory: string,ddbbConfig: LocalSettings) {
    if(!ddbbConfig.remove_empty_folders) return;
    try{
        const removedDirectories = await removeEmptyFoldersRecursively(directory, new Set());
        const n = removedDirectories.size;
        if(n>0){
            const message = `Removed ${n} empty director${n===0||n>1? 'ies':'y'}`
            new Notice(message, 1500);
        }
    } catch (error) {
        new Notice( `Error while removing empty folders: ${error.message}`, 5000);
        throw error;
    }
}
