import { t } from "lang/helpers";
import { Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_setting_header } from "settings/SettingsComponents";

export class MetadataToggleGroupHandler extends AbstractSettingsHandler {
    settingTitle: string = t("settings_metatata_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local, view } = settingHandlerResponse;
        const metadata_section = containerEl.createDiv("configuration-section-container-columns-metadata");
        // title of the section
        add_setting_header(metadata_section, this.settingTitle, 'h4');
        /*************************
         * METADATA CREATED COLUMN
         *************************/
        const metadata_created_toggle_promise = async (value: boolean): Promise<void> => {
            // Check context to define correct promise
            if (local) {
                // Persist value
                view.diskConfig.updateConfig({ show_metadata_created: value });
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

        new Setting(metadata_section)
            .setName(t("settings_metatata_create_toggle_title"))
            .setDesc(t("settings_metatata_create_toggle_desc"))
            .addToggle(toggle =>
                toggle.setValue(local ? view.diskConfig.yaml.config.show_metadata_created : settingsManager.plugin.settings.local_settings.show_metadata_created)
                    .onChange(metadata_created_toggle_promise)
            )

        /*************************
        * METADATA MODIFIED COLUMN
        *************************/
        const metadata_modified_toggle_promise = async (value: boolean): Promise<void> => {
            // Check context to define correct promise
            if (local) {
                // Persist value
                view.diskConfig.updateConfig({ show_metadata_modified: value });
            } else {
                // switch show modified on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.show_metadata_modified = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        }

        new Setting(metadata_section)
            .setName(t("settings_metatata_modified_toggle_title"))
            .setDesc(t("settings_metatata_modified_toggle_desc"))
            .addToggle(toggle =>
                toggle.setValue(local ? view.diskConfig.yaml.config.show_metadata_modified : settingsManager.plugin.settings.local_settings.show_metadata_modified)
                    .onChange(metadata_modified_toggle_promise)
            );

        /*************************
        * METADATA TASK COLUMN
        *************************/
        const metadata_tasks_toggle_promise = async (value: boolean): Promise<void> => {
            // Check context to define correct promise
            if (local) {
                // Persist value
                view.diskConfig.updateConfig({ show_metadata_tasks: value });
            } else {
                // switch show task on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.show_metadata_tasks = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        }

        new Setting(metadata_section)
            .setName(t("settings_metatata_task_toggle_title"))
            .setDesc(t("settings_metatata_task_toggle_desc"))
            .addToggle(toggle =>
                toggle.setValue(local ? view.diskConfig.yaml.config.show_metadata_tasks : settingsManager.plugin.settings.local_settings.show_metadata_tasks)
                    .onChange(metadata_tasks_toggle_promise)
            );

        /*************************
        * INLINKS COLUMN
        *************************/
        const metadata_inlinks_toggle_promise = async (value: boolean): Promise<void> => {
            // Check context to define correct promise
            if (local) {
                // Persist value
                view.diskConfig.updateConfig({ show_metadata_inlinks: value });
            } else {
                // switch show task on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.show_metadata_inlinks = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        }

        new Setting(metadata_section)
            .setName(t("settings_metatata_inlinks_toggle_title"))
            .setDesc(t("settings_metatata_inlinks_toggle_desc"))
            .addToggle(toggle =>
                toggle.setValue(local ? view.diskConfig.yaml.config.show_metadata_inlinks : settingsManager.plugin.settings.local_settings.show_metadata_inlinks)
                    .onChange(metadata_inlinks_toggle_promise)
            );

        /*************************
        * OUTLINKS COLUMN
        *************************/
        const metadata_outlinks_toggle_promise = async (value: boolean): Promise<void> => {
            // Check context to define correct promise
            if (local) {
                // Persist value
                view.diskConfig.updateConfig({ show_metadata_outlinks: value });
            } else {
                // switch show task on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.show_metadata_outlinks = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        }

        new Setting(metadata_section)
            .setName(t("settings_metatata_outlinks_toggle_title"))
            .setDesc(t("settings_metatata_outlinks_toggle_desc"))
            .addToggle(toggle =>
                toggle.setValue(local ? view.diskConfig.yaml.config.show_metadata_outlinks : settingsManager.plugin.settings.local_settings.show_metadata_outlinks)
                    .onChange(metadata_outlinks_toggle_promise)
            );

        return this.goNext(settingHandlerResponse);
    }
}