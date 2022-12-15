import { c } from "helpers/StylesHelper";
import {
    Modal,
    TextAreaComponent,
} from "obsidian";

/**
 * A modal that prompts the user for text input using a builder pattern.
 */
export class TextAreaModal extends Modal {
    private resolve: (value: string) => void;
    private reject: () => void;
    private submitted = false;
    private value: string;
    private placeholder = "Type text here";
    constructor(
        private prompt_text: string,
        private default_value: string
    ) {
        super(app);
    }

    setPlaceholder(placeholder: string): TextAreaModal {
        this.placeholder = placeholder;
        return this;
    }

    onOpen(): void {
        this.titleEl.setText(this.prompt_text);
        this.createForm();
    }

    onClose(): void {
        this.contentEl.empty();
        if (!this.submitted) {
            this.reject();
        }
    }

    createForm(): void {
        const div = this.contentEl.createDiv();
        div.addClass(c("prompt-modal"));
        const textInput = new TextAreaComponent(div);
        this.value = this.default_value ?? "";
        textInput.inputEl.addClass(c("textarea-modal"));
        textInput.setPlaceholder(this.placeholder);
        textInput.setValue(this.value);
        textInput.onChange((value) => (this.value = value));
        textInput.inputEl.addEventListener("keydown", (evt: KeyboardEvent) =>
            this.enterCallback(evt)
        );
    }

    private enterCallback(evt: KeyboardEvent) {
        if (evt.key === "Enter") {
            this.resolveAndClose(evt);
        }

    }

    private resolveAndClose(evt: Event | KeyboardEvent) {
        this.submitted = true;
        evt.preventDefault();
        this.resolve(this.value);
        this.close();
    }

    async openAndGetValue(
        resolve: (value: string) => void,
        reject: () => void
    ): Promise<void> {
        this.resolve = resolve;
        this.reject = reject;
        this.open();
    }
}