import { t } from "lang/helpers";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_toggle } from "settings/SettingsComponents";

export class FrontmatterQuotesToggleHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_editing_engine_frontmatter_quotes_toggle_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local, view } = settingHandlerResponse;
        const table_state_togle_promise = async (value: boolean): Promise<void> => {
            // Check context to define correct promise
            if (local) {
                // Persist value
                view.diskConfig.updateConfig({ frontmatter_quote_wrap: value });
            } else {
                // switch option state on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.frontmatter_quote_wrap = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        }
        add_toggle(
            containerEl,
            this.settingTitle,
            t("settings_editing_engine_frontmatter_quotes_toggle_desc"),
            local ? view.diskConfig.yaml.config.frontmatter_quote_wrap : settingsManager.plugin.settings.local_settings.frontmatter_quote_wrap,
            table_state_togle_promise
        );
        return this.goNext(settingHandlerResponse);
    }
}