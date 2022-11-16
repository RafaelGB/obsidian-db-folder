import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_toggle } from "settings/SettingsComponents";

export class StickyFirstColumnHandler extends AbstractSettingsHandler {
    settingTitle = 'Sticky first column';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { containerEl, view, local, settingsManager } = settingHandlerResponse;
        const sticky_first_column_toggle_promise = async (value: boolean): Promise<void> => {
            if (local) {
                // update settings
                view.diskConfig.updateConfig({ sticky_first_column: value });
            } else {
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.sticky_first_column = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        };
        const current_sticky_first_column = local ?
            view.diskConfig.yaml.config.sticky_first_column :
            settingsManager.plugin.settings.local_settings.sticky_first_column;

        add_toggle(
            containerEl,
            this.settingTitle,
            "Whether to make the first column sticky, so that it remains visible when scrolling horizontally.",
            current_sticky_first_column,
            sticky_first_column_toggle_promise
        );

        return this.goNext(settingHandlerResponse);
    }
}