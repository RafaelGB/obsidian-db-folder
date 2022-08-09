import { AddColumnModalHandlerResponse } from "cdm/ModalsModel";
import { TableStateInterface } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import { StyleClasses } from "helpers/Constants";
import { Modal } from "obsidian";
import { add_setting_header } from "settings/SettingsComponents";

export class AddColumnModal extends Modal {
    view: DatabaseView;
    tableState: TableStateInterface;
    addColumnManager: AddColumnModalManager;
    constructor(
        view: DatabaseView,
        tableState: TableStateInterface
    ) {
        super(view.app);
        this.view = view;
        this.tableState = tableState;
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
        //this.view.reloadDatabase();
    }
}

export class AddColumnModalManager {
    view: DatabaseView;
    tableState: TableStateInterface;
    constructor(
        view: DatabaseView,
        tableState: TableStateInterface
    ) {
        this.view = view;
        this.tableState = tableState;
    }
    constructUI(containerEl: HTMLElement) {
        /** Common modal headings */
        containerEl.addClass(StyleClasses.ADD_COLUMN_MODAL);
        add_setting_header(containerEl, `Add column options`, 'h2');

        const addColumnBody = containerEl.createDiv();
        addColumnBody.addClass(StyleClasses.COLUMN_MODAL_BODY);
        addColumnBody.setAttribute("id", StyleClasses.COLUMN_MODAL_BODY);
        const initialResponse: AddColumnModalHandlerResponse = {
            containerEl: addColumnBody,
            addColumnModalManager: this,
            view: this.view,
        };
        this.constructBody(initialResponse);
    }

    constructBody(response: AddColumnModalHandlerResponse) {

    }

    reset(response: AddColumnModalHandlerResponse) {
        const columnElement = activeDocument.getElementById(StyleClasses.ADD_COLUMN_BODY);
        // remove all sections
        columnElement.empty();
        this.constructBody(response);
    }
}