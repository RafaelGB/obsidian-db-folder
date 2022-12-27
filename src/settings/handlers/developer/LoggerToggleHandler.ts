import { LOGGER } from "services/Logger";
import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { t } from "lang/helpers";
export class LoggerToggleHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_developer_enable_toggle_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local } = settingHandlerResponse;
        // pass if modal opened from local settings
        if (!local) {
            const logger_togle_promise = async (value: boolean): Promise<void> => {
                // set debug mode
                const update_global_settings = settingsManager.plugin.settings.global_settings;
                update_global_settings.enable_debug_mode = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    global_settings: update_global_settings
                });
                // update service value
                LOGGER.setDebugMode(value);
                // Force refresh of settings
                settingsManager.reset(settingHandlerResponse);
            }
            add_toggle(
                containerEl,
                this.settingTitle,
                t("settings_developer_enable_toggle_desc"),
                settingsManager.plugin.settings.global_settings.enable_debug_mode,
                logger_togle_promise
            );
        }
        return this.goNext(settingHandlerResponse);
    }
}