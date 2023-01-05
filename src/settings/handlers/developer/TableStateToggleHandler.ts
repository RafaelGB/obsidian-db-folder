import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { t } from "lang/helpers";
export class TableStateToggleHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_developer_table_state_toggle_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl } = settingHandlerResponse;
        const table_state_togle_promise = async (value: boolean): Promise<void> => {
            // Check context to define correct promise

            // switch table state on/off
            const update_global_settings = settingsManager.plugin.settings.global_settings;
            update_global_settings.enable_show_state = value;
            // update settings
            await settingsManager.plugin.updateSettings({
                global_settings: update_global_settings
            });
        }

        add_toggle(
            containerEl,
            this.settingTitle,
            t("settings_developer_table_state_toggle_desc"),
            settingsManager.plugin.settings.global_settings.enable_show_state,
            table_state_togle_promise
        );

        return this.goNext(settingHandlerResponse);
    }
}