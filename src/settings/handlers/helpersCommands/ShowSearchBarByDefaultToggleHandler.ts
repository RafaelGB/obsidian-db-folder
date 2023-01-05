import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { t } from "lang/helpers";
export class ShowSearchBarByDefaultToggleHandler extends AbstractSettingsHandler {
    settingTitle: string = t("settings_helper_default_search_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local } = settingHandlerResponse;
        // pass if modal opened from local settings
        if (!local) {
            const searchbar_toggle_promise = async (value: boolean): Promise<void> => {
                // set debug mode
                const updated_global_settings = settingsManager.plugin.settings.global_settings;
                updated_global_settings.show_search_bar_by_default = value;

                // update settings
                await settingsManager.plugin.updateSettings({
                    global_settings: updated_global_settings
                });
            }

            add_toggle(
                containerEl,
                this.settingTitle,
                t("settings_helper_default_search_desc"),
                settingsManager.plugin.settings.global_settings.show_search_bar_by_default,
                searchbar_toggle_promise
            );
        }

        return this.goNext(settingHandlerResponse);
    }
}