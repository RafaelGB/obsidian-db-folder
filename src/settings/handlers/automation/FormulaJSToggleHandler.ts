import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { t } from "lang/helpers";
export class FormulaJSToggleHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_formula_toggle_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, view, local } = settingHandlerResponse;
        // pass if modal opened from local settings
        const formulas_togle_promise = async (value: boolean): Promise<void> => {
            if (local) {
                // update settings
                view.diskConfig.updateConfig({ enable_js_formulas: value });
            } else {
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.enable_js_formulas = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
            // Force refresh of settings
            settingsManager.reset(settingHandlerResponse);
        }
        add_toggle(
            containerEl,
            this.settingTitle,
            t("settings_formula_toggle_desc"),
            local ? view.diskConfig.yaml.config.enable_js_formulas : settingsManager.plugin.settings.local_settings.enable_js_formulas,
            formulas_togle_promise
        );

        return this.goNext(settingHandlerResponse);
    }
}