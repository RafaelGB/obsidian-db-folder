import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandler, SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { GroupFolderColumnDropDownHandler } from 'settings/handlers/columns/GroupFolderColumnDropDownHandler';

/**
 * developer settings section
 */
export function columns_settings_section(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
    settingHandlerResponse.containerEl = settingHandlerResponse.containerEl.createDiv("configuration-section-container-columns");
    // title of the section
    add_setting_header(settingHandlerResponse.containerEl, "Configuration about columns", 'h3');
    // section settings
    const handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }
    return handlers[0].handle(settingHandlerResponse);
}

/**
 * Obtain all classes than extends from AbstractHandler
 */
function getHandlers(): SettingHandler[] {
    return [
        new GroupFolderColumnDropDownHandler()
    ];
}