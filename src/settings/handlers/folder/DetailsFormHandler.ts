import { t } from "lang/helpers";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_text } from "settings/SettingsComponents";

export class DetailsFormHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_details_name_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { containerEl, view, local } = settingHandlerResponse;
        if (local) {
            const details_edit_name_promise = async (value: string): Promise<void> => {
                view.diskConfig.updateYaml('name', value);
            }

            const details_edit_desciption_promise = async (value: string): Promise<void> => {
                view.diskConfig.updateYaml('description', value);
            }
            add_text(
                containerEl,
                this.settingTitle,
                t("settings_details_name_desc"),
                t("settings_details_name_placeholder"),
                view.diskConfig.yaml.name,
                details_edit_name_promise
            );
            add_text(
                containerEl,
                t("settings_details_description_title"),
                t("settings_details_description_desc"),
                t("settings_details_description_placeholder"),
                view.diskConfig.yaml.description,
                details_edit_desciption_promise
            );
        }
        return this.goNext(settingHandlerResponse);
    }
}