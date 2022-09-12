import { DEFAULT_SETTINGS } from "helpers/Constants";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_text } from "settings/SettingsComponents";

export class CSVHeaderFileKeyHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Mandatory header key';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl } = settingHandlerResponse;
        const details_edit_desciption_promise = async (value: string): Promise<void> => {
            // set dropdown value
            const update_global_settings = settingsManager.plugin.settings.global_settings;
            update_global_settings.csv_file_header_key = value;
            // update settings
            settingsManager.plugin.updateSettings({ global_settings: update_global_settings });
        }
        add_text(
            containerEl,
            this.settingTitle,
            "This setting defines the mandatory header key that must be present in the csv file",
            "file key...",
            settingsManager.plugin.settings.global_settings.csv_file_header_key ?? DEFAULT_SETTINGS.global_settings.csv_file_header_key,
            details_edit_desciption_promise
        );

        return this.goNext(settingHandlerResponse);
    }
}