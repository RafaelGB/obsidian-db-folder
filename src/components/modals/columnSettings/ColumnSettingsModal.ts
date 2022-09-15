import { TableColumn } from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import { Modal } from "obsidian";
import { add_setting_header } from "settings/SettingsComponents";
import { StyleClasses } from "helpers/Constants";
import { ColumnSettingsHandlerResponse, ColumnSettingsModalProps } from "cdm/ModalsModel";
import { particular_settings_section, behavior_settings_section, style_settings_section } from "components/modals/columnSettings/ColumnSections";
import { HeaderMenuProps } from "cdm/HeaderModel";
import { ColumnsState, ConfigState, DataState } from "cdm/TableStateInterface";

export class ColumnSettingsModal extends Modal {
    view: DatabaseView;
    headerMenuProps: HeaderMenuProps;
    columnSettingsManager: ColumnSettingsManager;
    dataState: Partial<DataState>;
    configState: Partial<ConfigState>;
    columnsState: Partial<ColumnsState>;
    enableReset: boolean = false;
    constructor(
        props: ColumnSettingsModalProps
    ) {
        const { view, headerMenuProps, dataState, configState, columnState } = props;
        super(view.app);
        this.view = view;
        this.dataState = dataState;
        this.configState = configState;
        this.columnsState = columnState;
        this.headerMenuProps = headerMenuProps;
        this.columnSettingsManager = new ColumnSettingsManager(this);
    }

    onOpen() {
        const { contentEl } = this;
        contentEl.empty();
        this.columnSettingsManager.constructUI(contentEl);
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
        if (this.enableReset) {
            this.view.reloadDatabase();
        }
    }
}
export class ColumnSettingsManager {
    modal: ColumnSettingsModal;
    constructor(
        modal: ColumnSettingsModal
    ) {
        this.modal = modal;
    }
    constructUI(containerEl: HTMLElement) {
        const column = this.modal.headerMenuProps.headerProps.column.columnDef as TableColumn
        /** Common modal headings */
        containerEl.addClass(StyleClasses.COLUMN_MODAL);
        add_setting_header(containerEl, `Settings of ${column.label} column`, 'h2');

        const settingBody = containerEl.createDiv();
        settingBody.addClass(StyleClasses.COLUMN_MODAL_BODY);
        settingBody.setAttribute("id", StyleClasses.COLUMN_MODAL_BODY);
        const initialResponse: ColumnSettingsHandlerResponse = {
            containerEl: settingBody,
            column: column,
            columnSettingsManager: this
        };
        this.constructBody(initialResponse);
    }

    constructBody(response: ColumnSettingsHandlerResponse) {
        /** behavior section */
        behavior_settings_section.run(response);
        /** styles section */
        style_settings_section.run(response);
        /** Particular settings section */
        particular_settings_section.run(response);
    }

    reset(response: ColumnSettingsHandlerResponse) {
        const columnElement = activeDocument.getElementById(StyleClasses.COLUMN_MODAL_BODY);
        // remove all sections
        columnElement.empty();
        response.containerEl = columnElement;
        this.constructBody(response);
    }
}
