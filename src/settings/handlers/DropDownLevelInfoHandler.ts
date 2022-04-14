import { Setting } from "obsidian";
import { LOGGER } from "services/Logger";
import { SettingsManager } from "Settings";
import { AbstractSettingsHandler } from "settings/handlers/AbstractSettingHandler";

export class DropDownLevelInfoHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Enable debug mode';
    handle(settingsManager: SettingsManager, containerEl: HTMLElement, local: boolean): [string, string][] {
        if(!local && settingsManager.plugin.settings.enable_debug_mode){
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
                    settingsManager.plugin.settings.logger_level_info
                );
                dropdown.onChange((value) => {
                    settingsManager.plugin.updateSettings({ logger_level_info: value });
                    LOGGER.setLevelInfo(value);
                });
            });
        }
        if (this.nextHandler) {
            return this.nextHandler.handle(settingsManager, containerEl, local);
        }
        return this.listOfErrors;
    }
}