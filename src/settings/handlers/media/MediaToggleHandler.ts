import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { t } from "lang/helpers";
export class MediaToggleHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_default_media_link_toggle_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl } = settingHandlerResponse;
        // pass if modal opened from local settings
        const media_settings = settingsManager.plugin.settings.global_settings.media_settings;
        const media_togle_promise = async (value: boolean): Promise<void> => {
            media_settings.enable_media_view = value;
            // Check context to define correct promise
            // switch media state on/off
            const update_global_settings = settingsManager.plugin.settings.global_settings;
            update_global_settings.media_settings = media_settings;
            // update settings
            await settingsManager.plugin.updateSettings({
                global_settings: update_global_settings
            });

            // Force refresh of settings
            settingsManager.reset(settingHandlerResponse);
        }
        add_toggle(
            containerEl,
            this.settingTitle,
            t("settings_default_media_link_toggle_desc"),
            media_settings.enable_media_view,
            media_togle_promise
        );
        return this.goNext(settingHandlerResponse);
    }
}