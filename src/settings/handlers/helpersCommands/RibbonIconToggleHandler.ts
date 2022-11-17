import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
export class RibbonIconToggleHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Show/Hide Ribbon Icon';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local } = settingHandlerResponse;
        // pass if modal opened from local settings
        if (!local) {
            const ribbon_toggle_promise = async (value: boolean): Promise<void> => {
                // set debug mode
                const updated_global_settings = settingsManager.plugin.settings.global_settings;
                updated_global_settings.enable_ribbon_icon = value;

                if (updated_global_settings.enable_ribbon_icon) {
                    settingsManager.plugin.showRibbonIcon();
                } else {
                    settingsManager.plugin.ribbonIcon.remove();
                }


                // update settings
                await settingsManager.plugin.updateSettings({
                    global_settings: updated_global_settings
                });
            }


            add_toggle(
                containerEl,
                this.settingTitle,
                "This will show/hide the ribbon icon from bar",
                settingsManager.plugin.settings.global_settings.enable_ribbon_icon,
                ribbon_toggle_promise
            );
        }

        return this.goNext(settingHandlerResponse);
    }
}