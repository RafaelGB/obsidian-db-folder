import { t } from "lang/helpers";
import { Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_setting_header } from "settings/SettingsComponents";
import {DEFAULT_SETTINGS} from "../../../helpers/Constants";

export class DefaultMetadataToggleGroupHandler extends AbstractSettingsHandler {
    settingTitle: string = t("settings_metatata_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, local } = settingHandlerResponse;
        if (!local) {
            const metadata_section = containerEl.createDiv("configuration-section-container-columns-metadata");
            // title of the section
            add_setting_header(metadata_section, this.settingTitle, 'h4');
            /*************************
             * METADATA CREATED COLUMN
             *************************/
            const metadata_created_toggle_promise = async (value: boolean): Promise<void> => {
                // switch show created on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.show_metadata_created = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });

            }

            new Setting(metadata_section)
                .setName(t("settings_metatata_create_toggle_title"))
                .setDesc(t("settings_metatata_create_toggle_desc"))
                .addToggle(toggle =>
                    toggle.setValue(settingsManager.plugin.settings.local_settings.show_metadata_created)
                        .onChange(metadata_created_toggle_promise)
                )

            /*************************
            * METADATA MODIFIED COLUMN
            *************************/
            const metadata_modified_toggle_promise = async (value: boolean): Promise<void> => {
                // switch show modified on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.show_metadata_modified = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }

            new Setting(metadata_section)
                .setName(t("settings_metatata_modified_toggle_title"))
                .setDesc(t("settings_metatata_modified_toggle_desc"))
                .addToggle(toggle =>
                    toggle.setValue(settingsManager.plugin.settings.local_settings.show_metadata_modified)
                        .onChange(metadata_modified_toggle_promise)
                );

            /*************************
            * METADATA TASK COLUMN
            *************************/
            const metadata_tasks_toggle_promise = async (value: boolean): Promise<void> => {
                // switch show task on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.show_metadata_tasks = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }

            new Setting(metadata_section)
                .setName(t("settings_metatata_task_toggle_title"))
                .setDesc(t("settings_metatata_task_toggle_desc"))
                .addToggle(toggle =>
                    toggle.setValue(settingsManager.plugin.settings.local_settings.show_metadata_tasks)
                        .onChange(metadata_tasks_toggle_promise)
                );

            /*************************
            * INLINKS COLUMN
            *************************/
            const metadata_inlinks_toggle_promise = async (value: boolean): Promise<void> => {
                // switch show task on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.show_metadata_inlinks = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }

            new Setting(metadata_section)
                .setName(t("settings_metatata_inlinks_toggle_title"))
                .setDesc(t("settings_metatata_inlinks_toggle_desc"))
                .addToggle(toggle =>
                    toggle.setValue(settingsManager.plugin.settings.local_settings.show_metadata_inlinks)
                        .onChange(metadata_inlinks_toggle_promise)
                );

            /*************************
            * OUTLINKS COLUMN
            *************************/
            const metadata_outlinks_toggle_promise = async (value: boolean): Promise<void> => {
                // switch show task on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.show_metadata_outlinks = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }

            new Setting(metadata_section)
                .setName(t("settings_metatata_outlinks_toggle_title"))
                .setDesc(t("settings_metatata_outlinks_toggle_desc"))
                .addToggle(toggle =>
                    toggle.setValue(settingsManager.plugin.settings.local_settings.show_metadata_outlinks)
                        .onChange(metadata_outlinks_toggle_promise)
                );

            /*************************
             * METADATA TAGS COLUMN
             ************************/
            const metadata_tags_toggle_promise = async (value: boolean): Promise<void> => {
                // switch show tags on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.show_metadata_tags = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }

            new Setting(metadata_section)
                .setName(t("settings_metatata_tags_toggle_title"))
                .setDesc(t("settings_metatata_tags_toggle_desc"))
                .addToggle(toggle =>
                    toggle.setValue(settingsManager.plugin.settings.local_settings.show_metadata_tags)
                        .onChange(metadata_tags_toggle_promise)
                );

            /*************************
             * CHECKBOX TYPE COLUMN
             ************************/
            const metadata_checkbox_type_toggle_promise = async (value: boolean): Promise<void> => {
                // switch show tags on/off
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.binary_checkbox_type = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
                DEFAULT_SETTINGS.local_settings.binary_checkbox_type = value;
            }

            new Setting(metadata_section)
                .setName(t("settings_metatata_checkbox_type_toggle_title"))
                .setDesc(t("settings_metatata_checkbox_type_toggle_desc"))
                .addToggle(toggle =>
                    toggle.setValue(settingsManager.plugin.settings.local_settings.binary_checkbox_type)
                        .onChange(metadata_checkbox_type_toggle_promise)
                );
        }
        return this.goNext(settingHandlerResponse);
    }
}