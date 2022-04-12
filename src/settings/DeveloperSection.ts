import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandler } from 'settings/handlers/AbstractSettingHandler';
import { DebugToggleHandler } from 'settings/handlers/DebugToggleSettingHandler';
import { SettingsManager } from 'Settings';

/**
     * developer settings section
     */
export function developer_settings_section(settingsManager: SettingsManager, containerEl: HTMLElement, local: boolean): void {
    // title of the section
    add_setting_header(containerEl,"Developer section",'h3');
    // section settings
    const handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }
  handlers[0].handle(settingsManager, containerEl, local);
}

/**
 * Obtain all classes than extends from AbstractHandler
 */
 function getHandlers(): SettingHandler[] {
    return [
        new DebugToggleHandler()
    ];
}