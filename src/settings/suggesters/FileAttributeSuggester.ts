// Credits go to Liam's Periodic Notes Plugin: https://github.com/liamcain/obsidian-periodic-notes
import { TextInputSuggest } from "settings/suggesters/suggest";

export class FileAttributeSuggester extends TextInputSuggest<string> {

    constructor(inputEl: HTMLInputElement, private _options: string[]) {
        super(inputEl);
    }
    
    set options(options: string[]) {
        this._options = options;
    }
    getSuggestions(inputStr: string): string[] {
       
        const lowerCaseinputStr = inputStr.toLowerCase()
        return this._options.filter((option) => {
            return option.toLowerCase().includes(lowerCaseinputStr);
        });
    }

    renderSuggestion(value: string, el: HTMLElement): void {
        el.setText(value);
    }

    selectSuggestion(value: string): void {
        this.inputEl.value = value;
        this.inputEl.trigger("input");
        this.close();
    }
}
