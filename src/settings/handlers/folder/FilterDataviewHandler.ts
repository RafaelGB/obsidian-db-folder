import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_text } from "settings/SettingsComponents";

export class FilterDataviewHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Dataview query. WHERE';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { containerEl, local, view } = settingHandlerResponse;
        const details_edit_desciption_promise = async (value: string): Promise<void> => {
            view.diskConfig.updateConfig('dataview_query_filter', value);
        }
        if (local) {
            add_text(
                containerEl,
                this.settingTitle,
                "Filter notes inside this folder with same query syntax of dataview",
                "type title...",
                view.diskConfig.yaml.config.dataview_query_filter,
                details_edit_desciption_promise
            );
        } else {

        }
        return this.goNext(settingHandlerResponse);
    }
}