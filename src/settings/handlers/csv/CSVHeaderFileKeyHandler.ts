import { DEFAULT_SETTINGS } from "helpers/Constants";
import { t } from "lang/helpers";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_text } from "settings/SettingsComponents";

export class CSVHeaderFileKeyHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_csv__header_title");
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
            t("settings_csv__header_desc"),
            t("settings_csv__header_placeholder"),
            settingsManager.plugin.settings.global_settings.csv_file_header_key ?? DEFAULT_SETTINGS.global_settings.csv_file_header_key,
            details_edit_desciption_promise
        );

        return this.goNext(settingHandlerResponse);
    }
}