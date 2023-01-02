import { TextInputSuggest } from "settings/suggesters/suggest";

export class StringSuggest extends TextInputSuggest<String> {
    constructor(
        public inputEl: HTMLInputElement,
        public rawARecord: Record<string, string>,
    ) {
        super(inputEl);
    }


    getSuggestions(input_str: string): String[] {
        const array: String[] = [];
        const lower_input_str = input_str.toLowerCase();

        Object.keys(this.rawARecord).forEach((key) => {
            if (
                key.toLowerCase().contains(lower_input_str)
            ) {
                array.push(key);
            }
        });

        return array;
    }

    renderSuggestion(string: string, el: HTMLElement): void {
        el.setText(this.rawARecord[string]);
    }

    selectSuggestion(string: string): void {
        this.inputEl.value = string;
        this.inputEl.trigger("input");
        this.close();
    }

    setSuggestions(suggestions: Record<string, string>): StringSuggest {
        this.rawARecord = suggestions;
        return this;
    }

    removeSuggestion(string: string): StringSuggest {
        delete this.rawARecord[string];
        return this;
    }
}