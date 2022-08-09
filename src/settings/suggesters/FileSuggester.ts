// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes

import { TAbstractFile, TFile } from "obsidian";
import { TextInputSuggest } from "settings/suggesters/suggest";
import { get_tfiles_from_folder } from "helpers/FileManagement";

export enum FileSuggestMode {
    TemplateFiles,
    ScriptFiles,
}

export class FileSuggest extends TextInputSuggest<TFile> {
    constructor(
        public inputEl: HTMLInputElement,
        private folderPath: string,
    ) {
        super(inputEl);
    }

    get_folder(): string {
        return this.folderPath
    }

    getSuggestions(input_str: string): TFile[] {
        const all_files = get_tfiles_from_folder(input_str);
        if (!all_files) {
            return [];
        }

        const files: TFile[] = [];
        const lower_input_str = input_str.toLowerCase();

        all_files.forEach((file: TAbstractFile) => {
            if (
                file instanceof TFile &&
                file.extension === "md" &&
                file.path.toLowerCase().contains(lower_input_str)
            ) {
                files.push(file);
            }
        });

        return files;
    }

    renderSuggestion(file: TFile, el: HTMLElement): void {
        el.setText(file.path);
    }

    selectSuggestion(file: TFile): void {
        this.inputEl.value = file.path;
        this.inputEl.trigger("input");
        this.close();
    }
}