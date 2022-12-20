import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
export class EnableAutoUpdateToggleHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Enable Auto Update';
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
                "Enable auto update listener from other files. WARNING: requires restart to take effect.",
                settingsManager.plugin.settings.global_settings.enable_auto_update,
                searchbar_toggle_promise
            );
        }

        return this.goNext(settingHandlerResponse);
    }
}