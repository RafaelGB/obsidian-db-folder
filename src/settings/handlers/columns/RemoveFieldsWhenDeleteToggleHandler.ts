import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
export class RemoveFieldsWhenDeleteToggleHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Remove fields';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local, view } = settingHandlerResponse;
        const remove_fields_toggle_promise = async (value: boolean): Promise<void> => {
            // Check context to define correct promise
            if (local) {
                // Persist value
                view.diskConfig.updateConfig({ remove_field_when_delete_column: value });
            } else {
                // switch remove fields on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.remove_field_when_delete_column = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        }
        add_toggle(
            containerEl,
            this.settingTitle,
            "Enable/disable remove fields when a column is deleted",
            local ? view.diskConfig.yaml.config.remove_field_when_delete_column : settingsManager.plugin.settings.local_settings.remove_field_when_delete_column,
            remove_fields_toggle_promise
        );
        return this.goNext(settingHandlerResponse);
    }
}