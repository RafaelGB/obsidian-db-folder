import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_text } from "settings/SettingsComponents";

export class DetailsFormHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Information about your database:';
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
                this.settingTitle.concat(' (name)'),
                "name of the database",
                "type title...",
                view.diskConfig.yaml.name,
                details_edit_name_promise
            );
            add_text(
                containerEl,
                this.settingTitle.concat(' (description)'),
                "description of the database",
                "type description...",
                view.diskConfig.yaml.description,
                details_edit_desciption_promise
            );
        }
        return this.goNext(settingHandlerResponse);
    }
}