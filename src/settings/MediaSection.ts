import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandler, SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { MediaToggleHandler } from 'settings/handlers/media/MediaToggleHandler';
import { MediaDimensionsHandler } from 'settings/handlers/media/MediaDimensionsHandler';

/**
 * developer settings section
 */
export function media_settings_section(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
    const media_section = settingHandlerResponse.containerEl.createDiv("configuration-section-container-media");
    // title of the section
    add_setting_header(media_section, "Embedded media adjustments", 'h3');
    // section settings
    const handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }

    settingHandlerResponse.containerEl = media_section;
    return handlers[0]?.handle(settingHandlerResponse);
}

/**
 * Obtain all classes than extends from AbstractHandler
 */
function getHandlers(): SettingHandler[] {
    return [
        new MediaToggleHandler(),
        new MediaDimensionsHandler(),
    ];
}