import { c } from 'helpers/StylesHelper';
import { t } from 'lang/helpers';
import { Modal } from 'obsidian';


export class ConfirmModal extends Modal {
    confirm = t('confirm_modal_ok');
    cancel = t('confirm_modal_ko');
    callback: (response: boolean) => void;
    private message: string;
    constructor() {
        super(app);
    }
    onOpen(): void {
        this.display();
    }

    setMessage(message: string): ConfirmModal {
        this.message = message;
        return this;
    }

    display() {
        this.contentEl.empty();
        this.contentEl.createEl('p', { text: this.message });
        const controls = this.contentEl.createDiv({ cls: c('confirm-modal-controls') });
        const confirmButton = controls.createEl('button', { text: this.confirm, cls: 'mod-cta' });
        confirmButton.addEventListener('click', () => {
            this.callback(true);
            this.close();
        });
        const cancelButton = controls.createEl('button', { text: this.cancel });
        cancelButton.addEventListener('click', () => {
            this.callback(false);
            this.close();
        });
    }

    /**
     * Opens the modal and returns a promise that resolves to true if the user
     */
    isConfirmed(): Promise<boolean> {
        return new Promise((resolve) => {
            this.callback = resolve;
            this.open();
        });
    }
}