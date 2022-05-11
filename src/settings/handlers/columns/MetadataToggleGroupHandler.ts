import { Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_setting_header } from "settings/SettingsComponents";

export class MetadataToggleGroupHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Metadata toggle group';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local, view } = settingHandlerResponse;
        const metadata_section = containerEl.createDiv("configuration-section-container-columns-metadata");
        // title of the section
        add_setting_header(metadata_section, "Metadata", 'h4');
        const metadata_created_toggle_promise = async (value: boolean): Promise<void> => {
            // Check context to define correct promise
            if (local) {
                // Persist value
                view.diskConfig.updateConfig('show_metadata_created', value);
            } else {
                // switch show created on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.show_metadata_created = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        }

        const metadata_modified_toggle_promise = async (value: boolean): Promise<void> => {
            // Check context to define correct promise
            if (local) {
                // Persist value
                view.diskConfig.updateConfig('show_metadata_modified', value);
            } else {
                // switch show created on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.show_metadata_modified = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        }
        new Setting(metadata_section)
            .setName("Created")
            .setDesc("Enable/disable Created Metadata Column")
            .addToggle(toggle =>
                toggle.setValue(local ? view.diskConfig.yaml.config.show_metadata_created : settingsManager.plugin.settings.local_settings.show_metadata_created)
                    .onChange(metadata_created_toggle_promise)
            )

        new Setting(metadata_section)
            .setName("Modified")
            .setDesc("Enable/disable Modified Metadata Column")
            .addToggle(toggle =>
                toggle.setValue(local ? view.diskConfig.yaml.config.show_metadata_modified : settingsManager.plugin.settings.local_settings.show_metadata_modified)
                    .onChange(metadata_modified_toggle_promise)
            );

        return this.goNext(settingHandlerResponse);
    }
}