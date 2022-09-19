import { LocalSettings } from "cdm/SettingsModel";
import { DatabaseView } from "DatabaseView";
import HelperException from "errors/HelperException";
import { normalizePath, TAbstractFile, TFile, TFolder, Vault } from "obsidian";
import { INLINE_POSITION, SourceDataTypes } from "helpers/Constants";

export function resolve_tfile(file_str: string): TFile {
    file_str = normalizePath(file_str);

    const file = app.vault.getAbstractFileByPath(file_str);
    if (!file) {
        throw new HelperException(`File "${file_str}" doesn't exist`);
    }
    if (!(file instanceof TFile)) {
        throw new HelperException(`${file_str} is a folder, not a file`);
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
        throw new HelperException(`${folder_str} is a file, not a folder`);
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

export function destination_folder(view: DatabaseView, ddbbConfig: LocalSettings): string {
    let destination_folder = view.file.parent.path;
    switch (ddbbConfig.source_data) {
        case SourceDataTypes.TAG:
        case SourceDataTypes.OUTGOING_LINK:
        case SourceDataTypes.INCOMING_LINK:
        case SourceDataTypes.QUERY:
            destination_folder = ddbbConfig.source_destination_path;
            break;
        default:
        //Current folder
    }
    return destination_folder;
}

export function inline_regex_target_in_function_of(position: string, columnId: string, newValue: string, contentHasFrontmatter: boolean) {
    let regex_target = "";
    switch (position) {
        case INLINE_POSITION.BOTTOM:
            regex_target = contentHasFrontmatter ? `$1$2\n${columnId}:: ${newValue}` : `$1\n${columnId}:: ${newValue}`;
            break;
        default:
            regex_target = contentHasFrontmatter ? `$1\n${columnId}:: ${newValue}$2` : `${columnId}:: ${newValue}\n$1`;
    }
    return regex_target;
}