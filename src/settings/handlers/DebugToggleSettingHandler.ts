import { Setting } from "obsidian";
import { LOGGER } from "services/Logger";
import { SettingsManager } from "Settings";
import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler } from "settings/handlers/AbstractSettingHandler";
export class DebugToggleHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Enable debug mode';
    handle(settingsManager: SettingsManager, containerEl: HTMLElement, local: boolean): [string, string][] {
        // pass if modal opened from local settings
        if(!local){
            let debug_togle_promise = async (value: boolean): Promise<void> => {
                await settingsManager.plugin.updateSettings({ enable_debug_mode: value });
                LOGGER.setDebugMode(value);
                // Force refresh of settings
                settingsManager.constructSettingBody(containerEl, local);
            }
            add_toggle(
                containerEl,
                this.settingTitle, 
                "This will log all the errors and warnings in the console",
                settingsManager.plugin.settings.enable_debug_mode, 
                debug_togle_promise);
        }
        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(settingsManager, containerEl, local);
        }
        
        return this.listOfErrors;
    }
}