import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_toggle } from "settings/SettingsComponents";

export class StickyFirstColumnHandler extends AbstractSettingsHandler {
    settingTitle = 'Sticky first column';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, view } = settingHandlerResponse;
        const sticky_first_column_toggle_promise = async (value: boolean): Promise<void> => {
            // update settings
            view.diskConfig.updateConfig('sticky_first_column', value);
        };

        add_toggle(
            containerEl,
            this.settingTitle,
            "Whether to make the first column sticky, so that it remains visible when scrolling horizontally.",
            view.diskConfig.yaml.config.sticky_first_column,
            sticky_first_column_toggle_promise
        );

        return this.goNext(settingHandlerResponse);
    }
}