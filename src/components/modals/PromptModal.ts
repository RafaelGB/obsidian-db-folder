import {
    Modal,
    TextComponent,
} from "obsidian";

export class PromptModal extends Modal {
    private resolve: (value: string) => void;
    private reject: () => void;
    private submitted = false;
    private value: string;

    constructor(
        private prompt_text: string,
        private default_value: string
    ) {
        super(app);
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
        div.addClass("templater-prompt-div");
        let textInput;
        textInput = new TextComponent(div);
        this.value = this.default_value ?? "";
        textInput.inputEl.addClass("templater-prompt-input");
        textInput.setPlaceholder("Type text here");
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