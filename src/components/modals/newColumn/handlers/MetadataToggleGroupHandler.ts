import { AddColumnModalHandlerResponse } from "cdm/ModalsModel";
import { ColumnSettingsModal } from "components/modals/columnSettings/ColumnSettingsModal";
import { MetadataColumns } from "helpers/Constants";
import { t } from "lang/helpers";
import { Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { add_setting_header } from "settings/SettingsComponents";

export class MetadataToggleGroupHandler extends AbstractHandlerClass<AddColumnModalHandlerResponse> {
    settingTitle: string = t("settings_metatata_title");
    handle(response: AddColumnModalHandlerResponse): AddColumnModalHandlerResponse {
        const { containerEl, addColumnModalManager } = response;
        const { view } = addColumnModalManager.props;

        const metadata_section = containerEl.createDiv("configuration-section-container-columns-metadata");
        // title of the section
        add_setting_header(metadata_section, this.settingTitle, 'h4');
        /*************************
         * METADATA CREATED COLUMN
         *************************/
        const metadata_file_toggle_promise = async (value: boolean): Promise<void> => {
            // Persist value
            await view.diskConfig.updateColumnProperties(MetadataColumns.FILE, { isHidden: value });
            addColumnModalManager.addColumnModal.enableReset = true;
        }
        new Setting(metadata_section)
            .setName(t("settings_metatata_file_toggle_title"))
            .setDesc(t("settings_metatata_file_toggle_desc"))
            .addToggle(toggle =>
                toggle.setValue(view.diskConfig.yaml.columns.__file__.isHidden)
                    .onChange(metadata_file_toggle_promise)
            );

        /*************************
         * METADATA CREATED COLUMN
         *************************/
        const metadata_created_toggle_promise = async (value: boolean): Promise<void> => {
            // Persist value
            view.diskConfig.updateConfig({ show_metadata_created: value });
            addColumnModalManager.addColumnModal.enableReset = true;
        }
        new Setting(metadata_section)
            .setName(t("settings_metatata_create_toggle_title"))
            .setDesc(t("settings_metatata_create_toggle_desc"))
            .addToggle(toggle =>
                toggle.setValue(view.diskConfig.yaml.config.show_metadata_created)
                    .onChange(metadata_created_toggle_promise)
            );

        /*************************
        * METADATA MODIFIED COLUMN
        *************************/
        const metadata_modified_toggle_promise = async (value: boolean): Promise<void> => {
            // Persist value
            view.diskConfig.updateConfig({ show_metadata_modified: value });
            addColumnModalManager.addColumnModal.enableReset = true;
        }

        new Setting(metadata_section)
            .setName(t("settings_metatata_modified_toggle_title"))
            .setDesc(t("settings_metatata_modified_toggle_desc"))
            .addToggle(toggle =>
                toggle
                    .setValue(view.diskConfig.yaml.config.show_metadata_modified)
                    .onChange(metadata_modified_toggle_promise)
            );

        /*************************
        * METADATA TASK COLUMN
        *************************/
        const metadata_tasks_toggle_promise = async (value: boolean): Promise<void> => {
            // Persist value
            view.diskConfig.updateConfig({ show_metadata_tasks: value });
            addColumnModalManager.addColumnModal.enableReset = true;
        }

        new Setting(metadata_section)
            .setName(t("settings_metatata_task_toggle_title"))
            .setDesc(t("settings_metatata_task_toggle_desc"))
            .addToggle(toggle =>
                toggle.setValue(view.diskConfig.yaml.config.show_metadata_tasks)
                    .onChange(metadata_tasks_toggle_promise)
            );

        /*************************
        * INLINKS COLUMN
        *************************/
        const metadata_inlinks_toggle_promise = async (value: boolean): Promise<void> => {
            // Persist value
            view.diskConfig.updateConfig({ show_metadata_inlinks: value });
            addColumnModalManager.addColumnModal.enableReset = true;
        }

        new Setting(metadata_section)
            .setName(t("settings_metatata_inlinks_toggle_title"))
            .setDesc(t("settings_metatata_inlinks_toggle_desc"))
            .addToggle(toggle =>
                toggle.setValue(view.diskConfig.yaml.config.show_metadata_inlinks)
                    .onChange(metadata_inlinks_toggle_promise)
            );

        /*************************
        * OUTLINKS COLUMN
        *************************/
        const metadata_outlinks_toggle_promise = async (value: boolean): Promise<void> => {
            // Persist value
            view.diskConfig.updateConfig({ show_metadata_outlinks: value });
            addColumnModalManager.addColumnModal.enableReset = true;
        }

        new Setting(metadata_section)
            .setName(t("settings_metatata_outlinks_toggle_title"))
            .setDesc(t("settings_metatata_outlinks_toggle_desc"))
            .addToggle(toggle =>
                toggle.setValue(view.diskConfig.yaml.config.show_metadata_outlinks)
                    .onChange(metadata_outlinks_toggle_promise)
            );

        return this.goNext(response);
    }
}