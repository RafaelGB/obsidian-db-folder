import { AddColumnModalHandlerResponse, AddColumnModalProps } from "cdm/ModalsModel";
import { DatabaseView } from "DatabaseView";
import { StyleClasses } from "helpers/Constants";
import { Modal } from "obsidian";
import { add_setting_header } from "settings/SettingsComponents";
import { select_new_column_section } from "components/modals/newColumn/SelectNewColumnSection";
import { c } from "helpers/StylesHelper";
import { applyPluginModalStyle } from "components/styles/ModalStyles";

export class AddColumnModal extends Modal {
    view: DatabaseView;
    addColumnManager: AddColumnModalManager;
    enableReset: boolean = false;
    constructor(
        view: DatabaseView,
        props: AddColumnModalProps
    ) {
        super(view.app);
        this.view = view;
        this.addColumnManager = new AddColumnModalManager(this, props);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        this.addColumnManager.constructUI(contentEl);
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
        if (this.enableReset) {
            this.view.reloadDatabase();
        }
    }
}

export class AddColumnModalManager {
    addColumnModal: AddColumnModal;
    props: AddColumnModalProps;
    constructor(
        addColumnModal: AddColumnModal,
        props: AddColumnModalProps
    ) {
        this.addColumnModal = addColumnModal;
        this.props = props;
    }
    constructUI(containerEl: HTMLElement) {
        /** Common modal headings */
        containerEl.addClass(c(StyleClasses.ADD_COLUMN_MODAL));
        applyPluginModalStyle(containerEl);
        add_setting_header(containerEl, `Columns menu`, 'h2');

        const addColumnBody = containerEl.createDiv();
        addColumnBody.addClass(StyleClasses.ADD_COLUMN_MODAL_BODY);
        addColumnBody.setAttribute("id", StyleClasses.ADD_COLUMN_MODAL_BODY);
        const initialResponse: AddColumnModalHandlerResponse = {
            containerEl: addColumnBody,
            addColumnModalManager: this,
        };
        this.constructBody(initialResponse);
    }

    constructBody(response: AddColumnModalHandlerResponse) {
        /** select new column section */
        select_new_column_section.run(response);
    }

    reset(response: AddColumnModalHandlerResponse) {
        const columnElement = activeDocument.getElementById(StyleClasses.ADD_COLUMN_MODAL_BODY);
        // remove all sections
        columnElement.empty();
        this.constructBody(response);
    }
}