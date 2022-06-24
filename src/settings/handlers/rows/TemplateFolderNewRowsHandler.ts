import { Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { FolderSuggest } from "settings/suggesters/FolderSuggester";

export class TemplateFolderNewRowsHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Select Folder with templates for new rows';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { local, settingsManager, containerEl, view } = settingHandlerResponse;
        new Setting(containerEl)
            .setName("Rows template files folder location")
            .setDesc("Select folder with template files for new rows")
            .addSearch((cb) => {
                new FolderSuggest(cb.inputEl);
                cb.setPlaceholder("Example: folder1/folder2")
                    .setValue(local ? view.diskConfig.yaml.config.row_templates_folder : settingsManager.plugin.settings.local_settings.row_templates_folder)
                    .onChange((new_folder) => {
                        if (local) {
                            view.diskConfig.updateConfig('row_templates_folder', new_folder);
                        } else {
                            const update_local_settings = settingsManager.plugin.settings.local_settings;
                            update_local_settings.row_templates_folder = new_folder;
                            settingsManager.plugin.updateSettings({
                                local_settings: update_local_settings
                            });
                        }
                    });
            });
        return this.goNext(settingHandlerResponse);
    }
}