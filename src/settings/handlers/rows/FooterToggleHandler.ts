import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
export class FooterToggleHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Enable footer';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local, view } = settingHandlerResponse;
        const currentValue = local ?
            view.diskConfig.yaml.config.enable_footer :
            settingsManager.plugin.settings.global_settings.enable_row_shadow;
        const shadow_toggle_promise = async (value: boolean): Promise<void> => {
            if (local) {
                view.diskConfig.updateConfig({ enable_footer: value });
            } else {
                // set debug mode
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.enable_footer = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        }
        add_toggle(
            containerEl,
            this.settingTitle,
            "This will enable footer of the table",
            currentValue,
            shadow_toggle_promise
        );

        return this.goNext(settingHandlerResponse);
    }
}