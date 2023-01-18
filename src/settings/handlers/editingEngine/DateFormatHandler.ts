import { DatabaseView } from "views/DatabaseView";
import { DEFAULT_SETTINGS } from "helpers/Constants";
import { t } from "lang/helpers";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_text } from "settings/SettingsComponents";

export class DateFormatHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_editing_engine_date_format_title");
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
            this.settingTitle,
            t("settings_editing_engine_date_format_desc"),
            DEFAULT_SETTINGS.local_settings.date_format,
            this.current_date_format(
                local,
                view,
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
            t("settings_editing_engine_datetime_format_title"),
            t("settings_editing_engine_datetime_format_desc"),
            DEFAULT_SETTINGS.local_settings.datetime_format,
            this.current_datetime_format(
                local,
                view,
                settingsManager.plugin.settings.local_settings.datetime_format
            ),
            datetime_promise
        );
        /**********************
         * METADATA DATE FORMAT
         **********************/
        const metadata_date_promise = async (value: string): Promise<void> => {
            if (local) {
                // update settings
                view.diskConfig.updateConfig({ metadata_date_format: value });
            } else {
                // set dropdown value
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.metadata_date_format = value;
                // update settings
                settingsManager.plugin.updateSettings({ local_settings: update_local_settings });
            }
        }
        add_text(
            containerEl,
            t("settings_editing_engine_metadata_datetime_format_title"),
            t("settings_editing_engine_metadata_datetime_format_desc"),
            DEFAULT_SETTINGS.local_settings.metadata_date_format,
            this.current_medatada_date_format(
                local,
                view,
                settingsManager.plugin.settings.local_settings.metadata_date_format
            ),
            metadata_date_promise
        );
        return this.goNext(settingHandlerResponse);
    }

    private current_date_format(local: boolean, view: DatabaseView, default_value: string) {
        return local ?
            (view.diskConfig.yaml.config.date_format ?? DEFAULT_SETTINGS.local_settings.date_format) :
            (default_value ?? DEFAULT_SETTINGS.local_settings.date_format);
    }

    private current_datetime_format(local: boolean, view: DatabaseView, default_value: string) {
        return local ?
            (view.diskConfig.yaml.config.datetime_format ?? DEFAULT_SETTINGS.local_settings.datetime_format) :
            (default_value ?? DEFAULT_SETTINGS.local_settings.datetime_format);
    }

    private current_medatada_date_format(local: boolean, view: DatabaseView, default_value: string) {
        return local ?
            (view.diskConfig.yaml.config.metadata_date_format ?? DEFAULT_SETTINGS.local_settings.metadata_date_format) :
            (default_value ?? DEFAULT_SETTINGS.local_settings.metadata_date_format);
    }
}