import { DEFAULT_SETTINGS } from "helpers/Constants";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_text } from "settings/SettingsComponents";

export class DateFormatHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Date format';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local, view } = settingHandlerResponse;
        /*************
         * DATE FORMAT
         *************/
        const date_promise = async (value: string): Promise<void> => {
            if (local) {
                // update settings
                view.diskConfig.updateConfig({ date_format: value });
            } else {
                // set dropdown value
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.date_format = value;
                // update settings
                settingsManager.plugin.updateSettings({ local_settings: update_local_settings });
            }
        }
        add_text(
            containerEl,
            "Date format",
            "The format of the date.",
            "yyyy-mm-dd",
            current_date_format(
                local,
                view.diskConfig.yaml.config.date_format,
                settingsManager.plugin.settings.local_settings.date_format
            ),
            date_promise
        );
        /*****************
         * DATETIME FORMAT
         *****************/
        const datetime_promise = async (value: string): Promise<void> => {
            if (local) {
                // update settings
                view.diskConfig.updateConfig({ datetime_format: value });
            } else {
                // set dropdown value
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.datetime_format = value;
                // update settings
                settingsManager.plugin.updateSettings({ local_settings: update_local_settings });
            }
        }
        add_text(
            containerEl,
            "Datetime format",
            "The format of the datetime.",
            "yyyy-mm-dd hh:mm:ss",
            current_datetime_format(
                local,
                view.diskConfig.yaml.config.datetime_format,
                settingsManager.plugin.settings.local_settings.datetime_format
            ),
            datetime_promise
        );
        return this.goNext(settingHandlerResponse);
    }
}

function current_date_format(local: boolean, tableValue: string, default_value: string) {
    return local ?
        (tableValue ?? DEFAULT_SETTINGS.local_settings.date_format) :
        (default_value ?? DEFAULT_SETTINGS.local_settings.date_format);
}

function current_datetime_format(local: boolean, tableValue: string, default_value: string) {
    return local ?
        (tableValue ?? DEFAULT_SETTINGS.local_settings.datetime_format) :
        (default_value ?? DEFAULT_SETTINGS.local_settings.datetime_format);
}