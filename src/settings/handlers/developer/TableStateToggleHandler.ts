
import { SettingsManager } from "Settings";
import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler } from "settings/handlers/AbstractSettingHandler";
export class LoggerLevelInfoDropDownHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Show state of table';
    handle(settingsManager: SettingsManager, containerEl: HTMLElement, local: boolean): [string, string][] {
        if(settingsManager.plugin.settings.global_settings.enable_debug_mode){
            
        }
        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(settingsManager, containerEl, local);
        }
        return this.listOfErrors;
    }
}