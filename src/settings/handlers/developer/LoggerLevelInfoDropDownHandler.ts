import { t } from "lang/helpers";
import { LOGGER } from "services/Logger";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_dropdown } from "settings/SettingsComponents";

export class LoggerLevelInfoDropDownHandler extends AbstractSettingsHandler {
    settingTitle = t('settings_developer_log_level_title');
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local } = settingHandlerResponse;
        if (!local && settingsManager.plugin.settings.global_settings.enable_debug_mode) {
            const logger_level_info_dropdown = async (value: string): Promise<void> => {
                // set dropdown value
                const update_global_settings = settingsManager.plugin.settings.global_settings;
                update_global_settings.logger_level_info = value;
                // update settings
                settingsManager.plugin.updateSettings({ global_settings: update_global_settings });
                LOGGER.setLevelInfo(value);
            };
            // render dropdown inside container
            add_dropdown(
                containerEl,
                this.settingTitle,
                t('settings_developer_log_level_desc'),
                settingsManager.plugin.settings.global_settings.logger_level_info,
                {
                    debug: 'debug',
                    info: 'info',
                    warn: 'warn',
                    error: 'error'
                },
                logger_level_info_dropdown
            );
        }
        return this.goNext(settingHandlerResponse);
    }
}