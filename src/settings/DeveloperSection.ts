import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandler, SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { LoggerToggleHandler } from 'settings/handlers/developer/LoggerToggleHandler';
import { TableStateToggleHandler } from 'settings/handlers/developer/TableStateToggleHandler';
import { LoggerLevelInfoDropDownHandler } from 'settings/handlers/developer/LoggerLevelInfoDropDownHandler';

/**
 * developer settings section
 */
export function developer_settings_section(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
    const developer_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-developer");
    // title of the section
    add_setting_header(developer_section, "Developer section", 'h3');
    // section settings
    const handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }

    settingHandlerResponse.containerEl = developer_section;
    return handlers[0]?.handle(settingHandlerResponse);
}

/**
 * Obtain all classes than extends from AbstractHandler
 */
function getHandlers(): SettingHandler[] {
    return [
        new LoggerToggleHandler(),
        new LoggerLevelInfoDropDownHandler(),
        new TableStateToggleHandler()
    ];
}