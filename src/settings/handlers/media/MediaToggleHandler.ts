import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
export class MediaToggleHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Enable media links';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local, view } = settingHandlerResponse;
        // pass if modal opened from local settings

        const media_togle_promise = async (value: boolean): Promise<void> => {
            // Check context to define correct promise
            if (local) {
                // Persist value
                const { media_settings } = view.diskConfig.yaml.config;
                media_settings.enable_media_view = value;
                view.diskConfig.updateConfig('media_settings', media_settings);
            } else {
                // switch media state on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.media_settings.enable_media_view = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        }
        add_toggle(
            containerEl,
            this.settingTitle,
            "Enable/disable wrap media links with embedding content",
            settingsManager.plugin.settings.local_settings.media_settings.enable_media_view,
            media_togle_promise
        );
        return this.goNext(settingHandlerResponse);
    }
}