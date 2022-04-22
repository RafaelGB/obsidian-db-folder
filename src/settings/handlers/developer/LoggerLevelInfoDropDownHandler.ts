import { DatabaseView } from "DatabaseView";
import { Setting } from "obsidian";
import { LOGGER } from "services/Logger";
import { SettingsManager } from "Settings";
import { AbstractSettingsHandler } from "settings/handlers/AbstractSettingHandler";

export class LoggerLevelInfoDropDownHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Enable debug mode';
    handle(settingsManager: SettingsManager, containerEl: HTMLElement, local: boolean, view?: DatabaseView): [string, string][] {
        if(!local && settingsManager.plugin.settings.global_settings.enable_debug_mode){
            new Setting(containerEl)
            .setName('Select level info of logs')
            .setDesc(
                'This setting assigns the level of logs that will be shown in the console.'
            )
            .addDropdown((dropdown) => {
                dropdown.addOption('debug', 'debug');
                dropdown.addOption('info', 'info');
                dropdown.addOption('warn', 'warn');
                dropdown.addOption('error', 'error');
                dropdown.setValue(
                    settingsManager.plugin.settings.global_settings.logger_level_info
                );
                dropdown.onChange((value) => {
                    // set dropdown value
                    const update_global_settings = settingsManager.plugin.settings.global_settings;
                    update_global_settings.logger_level_info = value;
                    // update settings
                    settingsManager.plugin.updateSettings({ global_settings: update_global_settings });
                    LOGGER.setLevelInfo(value);
                });
            });
        }
        if (this.nextHandler) {
            return this.nextHandler.handle(settingsManager, containerEl, local, view);
        }
        return this.listOfErrors;
    }
}