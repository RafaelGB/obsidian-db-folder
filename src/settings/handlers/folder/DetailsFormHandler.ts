import { c } from "helpers/StylesHelper";
import { t } from "lang/helpers";
import { Setting } from "obsidian";
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
            new Setting(containerEl)
                .setName(t("settings_details_description_title"))
                .setDesc(t("settings_details_description_desc"))
                .addTextArea((textArea) => {
                    textArea.setValue(view.diskConfig.yaml.description);
                    textArea.setPlaceholder(t("settings_details_description_placeholder"));
                    textArea.inputEl.addClass(c("textarea-setting"));
                    textArea.onChange(details_edit_desciption_promise);
                });
        }
        return this.goNext(settingHandlerResponse);
    }
}