import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
export class RowShadowToggleHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Enable row shadow';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local } = settingHandlerResponse;
        // pass if modal opened from local settings
        if (!local) {
            const shadow_toggle_promise = async (value: boolean): Promise<void> => {
                // set debug mode
                const update_global_settings = settingsManager.plugin.settings.global_settings;
                update_global_settings.enable_row_shadow = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    global_settings: update_global_settings
                });
            }
            add_toggle(
                containerEl,
                this.settingTitle,
                "This will enable row shadow to make it easier to distinguish between rows",
                settingsManager.plugin.settings.global_settings.enable_row_shadow,
                shadow_toggle_promise
            );
        }
        return this.goNext(settingHandlerResponse);
    }
}