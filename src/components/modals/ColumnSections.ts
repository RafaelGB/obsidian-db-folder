import { ColumnHandlerResponse } from "cdm/ModalSettingsModel";
import { add_setting_header } from "settings/SettingsComponents";
import { MediaDimensionsHandler } from "components/modals/handlers/MediaDimensionsHandler";
import { MediaToggleHandler } from "components/modals/handlers/MediaToggleHandler";
import { InlineToggleHandler } from "components/modals/handlers/InlineToggleHandler";

export function behavior_settings_section(settingHandlerResponse: ColumnHandlerResponse) {
    const behavior_section = settingHandlerResponse.containerEl.createDiv("column-section-container-behavior");
    add_setting_header(behavior_section, "Behavior", "h3");
    /**
     * Obtain all classes than extends from AbstractHandler
     */
    const handlers = [
        new InlineToggleHandler()
    ]
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }

    settingHandlerResponse.containerEl = behavior_section;
    return handlers[0].handle(settingHandlerResponse);
}

export function media_settings_section(settingHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
    const folder_section = settingHandlerResponse.containerEl.createDiv("column-section-container-media");
    // title of the section
    add_setting_header(folder_section, "Media adjustments", 'h3');
    /**
     * Obtain all classes than extends from AbstractHandler
     */
    const handlers = [
        new MediaToggleHandler(),
        new MediaDimensionsHandler(),
    ]
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }

    settingHandlerResponse.containerEl = folder_section;
    return handlers[0].handle(settingHandlerResponse);
}