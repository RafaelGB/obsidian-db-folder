import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandler, SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { SourceDropDownHandler } from 'settings/handlers/source/SourceDropDownHandler';
import { SourceFormHandler } from 'settings/handlers/source/SourceFormHandler';

/**
 * developer settings section
 */
export function source_settings_section(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
    const columns_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-source");
    // title of the section
    add_setting_header(columns_section, "Source of database", 'h3');
    // section settings
    const handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }
    settingHandlerResponse.containerEl = columns_section;
    return handlers[0]?.handle(settingHandlerResponse);
}

/**
 * Obtain all classes than extends from AbstractHandler
 */
function getHandlers(): SettingHandler[] {
    return [
        new SourceDropDownHandler(),
        new SourceFormHandler()
    ];
}