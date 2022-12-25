import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { t } from "lang/helpers";
export class EnableAutoUpdateToggleHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_helper_autoupdate_toggle_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local } = settingHandlerResponse;
        // pass if modal opened from local settings
        if (!local) {
            const searchbar_toggle_promise = async (value: boolean): Promise<void> => {
                // set debug mode
                const updated_global_settings = settingsManager.plugin.settings.global_settings;
                updated_global_settings.enable_auto_update = value;

                // update settings
                await settingsManager.plugin.updateSettings({
                    global_settings: updated_global_settings
                });
            }

            add_toggle(
                containerEl,
                this.settingTitle,
                t("settings_helper_autoupdate_toggle_desc"),
                settingsManager.plugin.settings.global_settings.enable_auto_update,
                searchbar_toggle_promise
            );
        }

        return this.goNext(settingHandlerResponse);
    }
}