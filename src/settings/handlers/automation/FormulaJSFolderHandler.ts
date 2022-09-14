import { Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { FolderSuggest } from "settings/suggesters/FolderSuggester";

export class FormulaJSFolderHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Select the source of your formula JS files';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, view, local } = settingHandlerResponse;
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
        console.log('FormulaJSFolderHandler bejore');
        // render dropdown inside container
        new Setting(containerEl)
            .setName('Select the formula JS folder')
            .setDesc('Select the destination of the formula JS files.')
            .addSearch((cb) => {
                new FolderSuggest(
                    cb.inputEl
                );
                cb.setPlaceholder("Example: path/to/folder")
                    .setValue(local ? view.diskConfig.yaml.config.formula_folder_path : settingsManager.plugin.settings.local_settings.formula_folder_path)
                    .onChange(formula_folder_promise);
            });

        console.log('FormulaJSFolderHandler after');
        return this.goNext(settingHandlerResponse);
    }
}