import { SourceDataTypes } from "helpers/Constants";
import { t } from "lang/helpers";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_dropdown } from "settings/SettingsComponents";

export class SourceDropDownHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_source_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, view } = settingHandlerResponse;
        const sourceOptions: Record<string, string> = {};
        Object.entries(SourceDataTypes).forEach(([, value]) => {
            sourceOptions[value] = t(value);
        });
        const source_dropdown_promise = async (value: string): Promise<void> => {
            // update settings
            view.diskConfig.updateConfig({
                source_data: value,
                source_form_result: ""
            });
            // Force refresh of settings
            settingsManager.reset(settingHandlerResponse);
        };
        // render dropdown inside container
        add_dropdown(
            containerEl,
            this.settingTitle,
            t("settings_source_desc"),
            view.diskConfig.yaml.config.source_data,
            sourceOptions,
            source_dropdown_promise
        );
        return this.goNext(settingHandlerResponse);
    }
}