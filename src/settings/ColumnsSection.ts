import { add_setting_header } from 'settings/SettingsComponents';
import { SettingHandler, SettingHandlerResponse } from 'settings/handlers/AbstractSettingHandler';
import { LoggerToggleHandler } from 'settings/handlers/developer/LoggerToggleHandler';
import { TableStateToggleHandler } from 'settings/handlers/developer/TableStateToggleHandler';
import { SettingsManager } from 'Settings';
import { LoggerLevelInfoDropDownHandler } from 'settings/handlers/developer/LoggerLevelInfoDropDownHandler';
import { DatabaseView } from 'DatabaseView';
import { StyleVariables } from 'helpers/Constants';

/**
 * developer settings section
 */
export function columns_settings_section(settingsManager: SettingsManager, containerEl: HTMLElement, local: boolean, view?: DatabaseView): void {
    // title of the section
    add_setting_header(containerEl,"Developer section",'h3');
    // add soft red background color to the section
    containerEl.style.backgroundColor = StyleVariables.BACKGROUND_MODIFIER_ERROR;
    // section settings
    const handlers = getHandlers();
    let i = 1;
    while (i < handlers.length) {
        handlers[i - 1].setNext(handlers[i]);
        i++;
    }
    const settingHandlerResponse: SettingHandlerResponse = {
        settingsManager: settingsManager,
        containerEl: containerEl,
        local: local,
        listOfErrors: [],
        view: view,
    };
    handlers[0].handle(settingHandlerResponse);
}

/**
 * Obtain all classes than extends from AbstractHandler
 */
 function getHandlers(): SettingHandler[] {
    return [
    ];
}