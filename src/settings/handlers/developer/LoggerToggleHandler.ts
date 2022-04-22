import { LOGGER } from "services/Logger";
import { SettingsManager } from "Settings";
import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler } from "settings/handlers/AbstractSettingHandler";
export class LoggerToggleHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Enable developer settings. Logger will be enabled';
    handle(settingsManager: SettingsManager, containerEl: HTMLElement, local: boolean): [string, string][] {
        // pass if modal opened from local settings
        if(!local){
            const logger_togle_promise = async (value: boolean): Promise<void> => {
                // set debug mode
                const update_global_settings = settingsManager.plugin.settings.global_settings;
                update_global_settings.enable_debug_mode = value;
                // update settings
                await settingsManager.plugin.updateSettings({ 
                    global_settings:update_global_settings 
                });
                // update service value
                LOGGER.setDebugMode(value);
                // Force refresh of settings
                settingsManager.constructSettingBody(containerEl, local);
            }
            add_toggle(
                containerEl,
                this.settingTitle, 
                "This will log all the errors and warnings in the console",
                settingsManager.plugin.settings.global_settings.enable_debug_mode, 
                logger_togle_promise
            );
        }
        // Check next handler
        if (this.nextHandler) {
            return this.nextHandler.handle(settingsManager, containerEl, local);
        }
        
        return this.listOfErrors;
    }
}