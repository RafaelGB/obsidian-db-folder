import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
export class LinkAliasToggleHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Default link alias state (on/off)';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl } = settingHandlerResponse;
        // pass if modal opened from local settings
        const media_settings = settingsManager.plugin.settings.global_settings.media_settings;
        if (media_settings.enable_media_view) {
            const media_togle_promise = async (value: boolean): Promise<void> => {
                media_settings.link_alias_enabled = value;
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
                "Use column label as link alias of your URLs",
                media_settings.link_alias_enabled,
                media_togle_promise
            );
        }
        return this.goNext(settingHandlerResponse);
    }
}