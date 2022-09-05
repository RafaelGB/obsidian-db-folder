import { Modal } from "obsidian";

export class DatabaseHelperCreationModal extends Modal {
    databaseHelperCreationModalManager: DatabaseHelperCreationModalManager;
    constructor() {
        super(app);
        this.databaseHelperCreationModalManager = new DatabaseHelperCreationModalManager(this);
    }
    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        this.databaseHelperCreationModalManager.constructUI(contentEl);
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

export class DatabaseHelperCreationModalManager {
    databaseHelperCreationModal: DatabaseHelperCreationModal;
    constructor(
        databaseHelperCreationModal: DatabaseHelperCreationModal,
    ) {
        this.databaseHelperCreationModal = databaseHelperCreationModal;
    }
    constructUI(containerEl: HTMLElement) {
    }
}
