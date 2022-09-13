import { Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { FolderSuggest } from "settings/suggesters/FolderSuggester";

export class FormulaJSFolderHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Select the source of database data';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, view } = settingHandlerResponse;
        const formula_folder_promise = async (value: string): Promise<void> => {
            // update settings
            view.diskConfig.updateConfig({ formula_folder_path: value });
            // Force refresh of settings
            settingsManager.reset(settingHandlerResponse);
        };
        // render dropdown inside container
        new Setting(containerEl)
            .setName('Select the formula JS folder')
            .setDesc('Select the destination of the formula JS files.')
            .addSearch((cb) => {
                new FolderSuggest(
                    cb.inputEl
                );
                cb.setPlaceholder("Example: path/to/folder")
                    .setValue(view.diskConfig.yaml.config.formula_folder_path)
                    .onChange(formula_folder_promise);
            });
        return this.goNext(settingHandlerResponse);
    }
}