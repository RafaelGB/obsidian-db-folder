import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { t } from "lang/helpers";
export class FooterToggleHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_footer_toggle_title");
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
            t("settings_footer_toggle_desc"),
            currentValue,
            shadow_toggle_promise
        );

        return this.goNext(settingHandlerResponse);
    }
}