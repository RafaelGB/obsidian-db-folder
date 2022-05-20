import { TableColumn } from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import { Modal } from "obsidian";
import { add_setting_header } from "settings/SettingsComponents";
import { ColumnHandler, ColumnHandlerResponse } from "components/modals/handlers/AbstractColumnHandler";
import { MediaDimensionsHandler } from "components/modals/handlers/MediaDimensionsHandler";
import { MediaToggleHandler } from "components/modals/handlers/MediaToggleHandler";

export class ColumnModal extends Modal {
    view: DatabaseView;
    column: TableColumn;
    constructor(
        view: DatabaseView,
        column: TableColumn
    ) {
        super(view.app);
        this.view = view;
        this.column = column;
    }

    onOpen() {
        const { contentEl, modalEl } = this;
        contentEl.empty();
        const initialResponse: ColumnHandlerResponse = {
            containerEl: contentEl,
            view: this.view,
            column: this.column,
        };
        folder_settings_section(initialResponse);
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

function folder_settings_section(settingHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
    const folder_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-folder");
    // title of the section
    add_setting_header(folder_section, "Folder adjustments", 'h3');
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