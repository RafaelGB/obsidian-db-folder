import { TableColumn } from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import { Modal } from "obsidian";
import { add_setting_header } from "settings/SettingsComponents";
import { ColumnHandler } from "components/modals/handlers/AbstractColumnHandler";
import { MediaDimensionsHandler } from "components/modals/handlers/MediaDimensionsHandler";
import { MediaToggleHandler } from "components/modals/handlers/MediaToggleHandler";
import { StyleClasses } from "helpers/Constants";
import { ColumnHandlerResponse } from "cdm/ModalSettingsModel";

export class ColumnModal extends Modal {
    view: DatabaseView;
    column: TableColumn;
    columnSettingsManager: ColumnSettingsManager;
    constructor(
        view: DatabaseView,
        column: TableColumn
    ) {
        super(view.app);
        this.view = view;
        this.column = column;
        this.columnSettingsManager = new ColumnSettingsManager(this.view, this.column);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        this.columnSettingsManager.constructUI(contentEl);
    }

    reset(columnHandlerResponse: ColumnHandlerResponse) {

    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
export class ColumnSettingsManager {
    view: DatabaseView;
    column: TableColumn;
    constructor(
        view: DatabaseView,
        column: TableColumn
    ) {
        this.view = view;
        this.column = column;
    }
    constructUI(containerEl: HTMLElement) {
        /** Common modal headings */
        containerEl.addClass(StyleClasses.COLUMN_MODAL);
        add_setting_header(containerEl, `Settings of ${this.column.label} column`, 'h2');

        const settingBody = containerEl.createDiv();
        settingBody.addClass(StyleClasses.COLUMN_MODAL_BODY);
        settingBody.setAttribute("id", StyleClasses.COLUMN_MODAL_BODY);
        const initialResponse: ColumnHandlerResponse = {
            containerEl: settingBody,
            view: this.view,
            column: this.column,
            columnSettingsManager: this
        };
        this.constructBody(initialResponse);
    }

    constructBody(settingHandlerResponse: ColumnHandlerResponse) {
        /** media section */
        media_settings_section(settingHandlerResponse);
    }

    reset(response: ColumnHandlerResponse) {
        const columnElement = document.getElementById(StyleClasses.COLUMN_MODAL_BODY);
        // remove all sections
        columnElement.empty();
        response.containerEl = columnElement;
        this.constructBody(response);
    }
}

function media_settings_section(settingHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
    const folder_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-folder");
    // title of the section
    add_setting_header(folder_section, "Media adjustments", 'h3');
    // section settings
    const handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }

    settingHandlerResponse.containerEl = folder_section;
    return handlers[0].handle(settingHandlerResponse);
}

/**
 * Obtain all classes than extends from AbstractHandler
 */
function getHandlers(): ColumnHandler[] {
    return [
        new MediaToggleHandler(),
        new MediaDimensionsHandler(),
    ];
}