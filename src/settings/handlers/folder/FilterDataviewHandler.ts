import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";

export class FilterDataviewHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Information about your database';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { containerEl, local, view } = settingHandlerResponse;
        if (local) {

        }
        return this.goNext(settingHandlerResponse);
    }
}