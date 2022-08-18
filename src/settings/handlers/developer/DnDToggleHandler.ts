import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
export class DnDToggleHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Enable drag and drop of columns';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local } = settingHandlerResponse;
        // pass if modal opened from local settings
        if (!local) {
            const dnd_togle_promise = async (value: boolean): Promise<void> => {
                // set debug mode
                const update_global_settings = settingsManager.plugin.settings.global_settings;
                update_global_settings.enable_dnd = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    global_settings: update_global_settings
                });
            }
            add_toggle(
                containerEl,
                this.settingTitle,
                "WARNING: enabling this will make the DnD of obsidian fail (for now). Restart the application after disabling this.",
                settingsManager.plugin.settings.global_settings.enable_dnd,
                dnd_togle_promise
            );
        }
        return this.goNext(settingHandlerResponse);
    }
}