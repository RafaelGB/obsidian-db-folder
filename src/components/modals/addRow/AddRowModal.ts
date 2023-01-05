import { DatabaseView } from "DatabaseView";
import { Modal } from "obsidian";
import { add_setting_header } from "settings/SettingsComponents";
import { StyleClasses } from "helpers/Constants";
import { AddRowModalHandlerResponse, AddRowModalProps } from "cdm/ModalsModel";
import { HeaderMenuProps } from "cdm/HeaderModel";
import { ConfigState, DataState } from "cdm/TableStateInterface";
import { c } from "helpers/StylesHelper";
import { t } from "lang/helpers";
import { add_row_section } from "components/modals/addRow/addRowSections";

export class AddRowModal extends Modal {
    view: DatabaseView;
    headerMenuProps: HeaderMenuProps;
    addRowModalManager: AddRowModalManager;
    state: AddRowModalProps;
    dataState: Partial<DataState>;
    configState: Partial<ConfigState>;
    enableReset = false;
    constructor(
        props: AddRowModalProps
    ) {
        super(app);
        this.state = props;
        this.addRowModalManager = new AddRowModalManager(this);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        this.addRowModalManager.constructUI(contentEl);
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
        if (this.enableReset) {
            this.view.reloadDatabase();
        }
    }
}
export class AddRowModalManager {
    modal: AddRowModal;
    constructor(
        modal: AddRowModal
    ) {
        this.modal = modal;
    }
    constructUI(containerEl: HTMLElement) {
        /** Common modal headings */
        containerEl.addClass(c(StyleClasses.ADD_ROW_MODAL));
        add_setting_header(containerEl, t("toolbar_menu_add_row"), 'h2');

        const settingBody = containerEl.createDiv();
        settingBody.addClass(c(StyleClasses.ADD_ROW_MODAL_BODY));
        settingBody.setAttribute("id", c(StyleClasses.ADD_ROW_MODAL_BODY));
        const initialResponse: AddRowModalHandlerResponse = {
            containerEl: settingBody,
            addRowModalManager: this
        };
        this.constructBody(initialResponse);
    }

    constructBody(response: AddRowModalHandlerResponse) {
        /** baadd rowse section */
        add_row_section.run(response);
    }

    reset(response: AddRowModalHandlerResponse) {
        const columnElement = activeDocument.getElementById(c(StyleClasses.ADD_ROW_MODAL_BODY));
        // remove all sections
        columnElement.empty();
        response.containerEl = columnElement;
        this.constructBody(response);
    }
}
