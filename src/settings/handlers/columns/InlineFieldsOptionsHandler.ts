import { add_dropdown, add_setting_header, add_toggle } from "settings/SettingsComponents";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { INLINE_POSITION } from "helpers/Constants";
import { t } from "lang/helpers";
export class InlineFieldsOptionsHandler extends AbstractSettingsHandler {
    settingTitle: string = t("settings_inline_options_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local, view } = settingHandlerResponse;
        const inline_section = containerEl.createDiv("configuration-section-container-columns-inline");
        // title of the section
        add_setting_header(inline_section, this.settingTitle, 'h4');
        /*********************************
         * TOGGLE INLINE FIELDS AS DEFAULT
         * *******************************/
        const logger_togle_promise = async (value: boolean): Promise<void> => {
            if (local) {
                // Persist value
                view.diskConfig.updateConfig({ inline_default: value });
            } else {
                // set debug mode
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.inline_default = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        }
        add_toggle(
            containerEl,
            t("settings_inline_options_default_toggle_title"),
            t("settings_inline_options_default_toggle_desc"),
            local ? view.diskConfig.yaml.config.inline_default : settingsManager.plugin.settings.local_settings.inline_default,
            logger_togle_promise
        );

        /************************************
         * DROPDOWN POSITION OF INLINE FIELDS
         * **********************************/
        const inline_position_dropdown_promise = async (value: string): Promise<void> => {
            if (local) {
                // Persist value
                view.diskConfig.updateConfig({ inline_new_position: value });
            } else {
                // set dropdown value
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.inline_new_position = value;
                // update settings
                settingsManager.plugin.updateSettings({ local_settings: update_local_settings });
            }
        };
        // render dropdown inside container
        const options: Record<string, string> = {};
        Object.entries(INLINE_POSITION).forEach(([key, value]) => {
            options[value] = t(value);
        });
        add_dropdown(
            containerEl,
            t("settings_inline_options_position_title"),
            t("settings_inline_options_position_desc"),
            local ? view.diskConfig.yaml.config.inline_new_position : settingsManager.plugin.settings.local_settings.inline_new_position,
            options,
            inline_position_dropdown_promise
        );
        return this.goNext(settingHandlerResponse);
    }
}