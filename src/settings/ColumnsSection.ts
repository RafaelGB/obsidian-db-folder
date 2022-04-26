import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandler, SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { SettingsManager } from 'Settings';
import { DatabaseView } from 'DatabaseView';
import { GroupFolderColumnDropDownHandler } from 'settings/handlers/columns/GroupFolderColumnDropDownHandler';

/**
 * developer settings section
 */
export function columns_settings_section(settingsManager: SettingsManager, containerEl: HTMLElement, local: boolean, view?: DatabaseView): void {
    const sectionContainer = containerEl .createDiv("configuration-section-container-columns");
    // title of the section
    add_setting_header(sectionContainer,"Configuration about columns",'h3');
    // section settings
    const handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }

    const settingHandlerResponse: SettingHandlerResponse = {
        settingsManager: settingsManager,
        containerEl: sectionContainer,
        local: local,
        errors: {},
        view: view,
    };
    handlers[0].handle(settingHandlerResponse);
}

/**
 * Obtain all classes than extends from AbstractHandler
 */
 function getHandlers(): SettingHandler[] {
    return [
        new GroupFolderColumnDropDownHandler()
    ];
}