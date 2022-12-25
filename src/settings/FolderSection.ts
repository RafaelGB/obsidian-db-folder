import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandler, SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { CellSizeDropDownHandler } from 'settings/handlers/folder/CellSizeDropDownHandler';
import { StickyFirstColumnHandler } from 'settings/handlers/folder/StickyFirstColumnHandler';
import { DetailsFormHandler } from 'settings/handlers/folder/DetailsFormHandler';
import { t } from 'lang/helpers';

/**
 * developer settings section
 */
export function folder_settings_section(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
    const folder_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-folder");
    // title of the section
    add_setting_header(folder_section, t("settings_folder_section"), 'h3');
    // section settings
    const handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }

    settingHandlerResponse.containerEl = folder_section;
    return handlers[0]?.handle(settingHandlerResponse);
}

/**
 * Obtain all classes than extends from AbstractHandler
 */
function getHandlers(): SettingHandler[] {
    return [
        new DetailsFormHandler(),
        new CellSizeDropDownHandler(),
        new StickyFirstColumnHandler(),
    ];
}