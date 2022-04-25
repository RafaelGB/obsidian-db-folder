import { add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
export class TableStateToggleHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Show state of table';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local, view} = settingHandlerResponse;
        if(settingsManager.plugin.settings.global_settings.enable_debug_mode){
            const table_state_togle_promise = async (value: boolean): Promise<void> => {
                // Check context to define correct promise
                if(local){
                    // Persist value
                    view .diskConfig.updateConfig('enable_show_state', value);
                }else{
                    // switch table state on/off
                    const update_local_settings = settingsManager.plugin.settings.local_settings;
                    update_local_settings.enable_show_state = value;
                    // update settings
                    await settingsManager.plugin.updateSettings({ 
                        local_settings:update_local_settings 
                    });
                }
            }
            add_toggle(
                containerEl,
                this.settingTitle, 
                "This will show/hide properties of the table on the bottom of the view",
                local ? view.diskConfig.yaml.config.enable_show_state : settingsManager.plugin.settings.local_settings.enable_show_state, 
                table_state_togle_promise
            );
        }
        return this.goNext(settingHandlerResponse);
    }
}