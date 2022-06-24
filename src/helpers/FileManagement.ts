import { HelperError } from "errors/HelperError";
import { normalizePath, TAbstractFile, TFile, TFolder, Vault } from "obsidian";

export function resolve_tfile(file_str: string): TFile {
    file_str = normalizePath(file_str);

    const file = app.vault.getAbstractFileByPath(file_str);
    if (!file) {
        throw new HelperError(`File "${file_str}" doesn't exist`);
    }
    if (!(file instanceof TFile)) {
        throw new HelperError(`${file_str} is a folder, not a file`);
    }

    return file;
}

export function resolve_tfolder(folder_str: string): TFolder {
    folder_str = normalizePath(folder_str);

    let folder = app.vault.getAbstractFileByPath(folder_str);
    if (!folder) {
        folder = resolve_tfolder(folder_str.split("/").slice(0, -1).join("/"));
    }
    if (!(folder instanceof TFolder)) {
        throw new HelperError(`${folder_str} is a file, not a folder`);
    }
    return folder;
}

export function get_tfiles_from_folder(
    folder_str: string
): Array<TFile> {
    let folder;
    try {
        folder = resolve_tfolder(folder_str);
    } catch (err) {
        // Split the string into '/' and remove the last element
        folder = resolve_tfolder(folder_str.split("/").slice(0, -1).join("/"));
    }
    const files: Array<TFile> = [];
    Vault.recurseChildren(folder, (file: TAbstractFile) => {
        if (file instanceof TFile) {
            files.push(file);
        }
    });

    files.sort((a, b) => {
        return a.basename.localeCompare(b.basename);
    });

    return files;
}