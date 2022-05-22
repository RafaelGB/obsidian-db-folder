import { TableColumn } from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import { Modal } from "obsidian";
import { add_setting_header } from "settings/SettingsComponents";
import { ActionTypes, StyleClasses } from "helpers/Constants";
import { ColumnHandlerResponse } from "cdm/ModalSettingsModel";
import { particular_settings_section, behavior_settings_section } from "components/modals/ColumnSections";
import { HeaderMenuProps } from "cdm/HeaderModel";
import { Dispatch } from "react";

export class ColumnModal extends Modal {
    view: DatabaseView;
    headerMenuProps: HeaderMenuProps;
    columnSettingsManager: ColumnSettingsManager;
    constructor(
        view: DatabaseView,
        headerMenuProps: HeaderMenuProps
    ) {
        super(view.app);
        this.view = view;
        this.headerMenuProps = headerMenuProps;
        this.columnSettingsManager = new ColumnSettingsManager(this.view, this.headerMenuProps.headerProps.column);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        this.columnSettingsManager.constructUI(contentEl);
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
        this.view.reloadDatabase();
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
        /** behavior section */
        behavior_settings_section(settingHandlerResponse);
        /** Particular settings section */
        particular_settings_section(settingHandlerResponse);
    }

    reset(response: ColumnHandlerResponse) {
        const columnElement = document.getElementById(StyleClasses.COLUMN_MODAL_BODY);
        // remove all sections
        columnElement.empty();
        response.containerEl = columnElement;
        this.constructBody(response);
    }
}

function handleColumnChanges(dispatch: Dispatch<any>, column: TableColumn) {
    dispatch({
        type: ActionTypes.MODIFY_COLUMN_CONFIG,
        columnId: column.id,
        columnConfig: column.config,
    });
}