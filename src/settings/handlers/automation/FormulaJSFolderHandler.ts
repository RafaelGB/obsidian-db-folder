import { t } from "lang/helpers";
import { Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { FolderSuggest } from "settings/suggesters/FolderSuggester";

export class FormulaJSFolderHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_formula_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, view, local } = settingHandlerResponse;
        const isJSFormulasEnabled = local ?
            view.diskConfig.yaml.config.enable_js_formulas :
            settingsManager.plugin.settings.local_settings.enable_js_formulas;
        if (isJSFormulasEnabled) {
            const formula_folder_promise = async (value: string): Promise<void> => {
                if (local) {
                    // update settings
                    view.diskConfig.updateConfig({ formula_folder_path: value });
                } else {
                    // switch show created on/off
                    const update_local_settings = settingsManager.plugin.settings.local_settings;
                    update_local_settings.formula_folder_path = value;
                    // update settings
                    await settingsManager.plugin.updateSettings({
                        local_settings: update_local_settings
                    });
                }

            };
            // render dropdown inside container
            new Setting(containerEl)
                .setName(this.settingTitle)
                .setDesc(t("settings_formula_desc"))
                .addSearch((cb) => {
                    new FolderSuggest(
                        cb.inputEl
                    );
                    cb.setPlaceholder(t("settings_formula_placeholder"))
                        .setValue(local ? view.diskConfig.yaml.config.formula_folder_path : settingsManager.plugin.settings.local_settings.formula_folder_path)
                        .onChange(formula_folder_promise);
                });
        }
        return this.goNext(settingHandlerResponse);
    }
}