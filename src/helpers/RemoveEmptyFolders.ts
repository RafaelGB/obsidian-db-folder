
export async function removeEmptyFolders(directory: string, deletedFolders: Set<string> ) {
    let list = await app.vault.adapter.list(directory);
    for (const folder of list.folders){
        deletedFolders = (await removeEmptyFolders((folder), deletedFolders))
    }
    
    list = await app.vault.adapter.list(directory);
    if (list.files.length === 0 && list.folders.length === 0) {
       
        await app.vault.adapter.rmdir(directory, false );
        deletedFolders.add(directory);
        console.log(`Removed empty folder: ${directory}`);
    }

    return deletedFolders
}
