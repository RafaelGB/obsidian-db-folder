import { DatabaseColumn } from "cdm/DatabaseModel";
import { RowDataType } from "cdm/FolderModel";
import { obtainColumnsFromFile, obtainColumnsFromRows } from "components/Columns";
import { DEFAULT_COLUMN_CONFIG, InputType } from "helpers/Constants";
import { resolve_tfile } from "helpers/FileManagement";
import { t } from "lang/helpers";
import { Notice, Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_setting_header } from "settings/SettingsComponents";

export class TemplateColumnsHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_template_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { local, containerEl, view, columns } = settingHandlerResponse;
        const template_section = containerEl.createDiv("configuration-section-container-columns-template");
        // Local exclusivey
        if (local) {
            // title of the section
            add_setting_header(template_section, this.settingTitle, 'h4');
            /***************************
             * TEMPLATE OF SELECTED FILE
             ***************************/
            let selected_file: string = "";
            const filePaths: Record<string, string> = {};
            view.rows.forEach((row: RowDataType) => {
                if (row.__note__) {
                    filePaths[row.__note__.getFile().path] = row.__note__.getFile().basename;
                }
            });
            new Setting(template_section)
                .setName(t("settings_template_file_title"))
                .setDesc(t("settings_template_file_desc"))
                .addDropdown((dropdown) => {
                    dropdown
                    dropdown.addOptions(filePaths);
                    dropdown.setValue("-");
                    dropdown.onChange((value: string) => {
                        selected_file = value;
                    });
                }).addExtraButton((cb) => {
                    cb.setIcon("save")
                        .setTooltip(t("settings_template_file_button_tooltip"))
                        .onClick(async (): Promise<void> => {
                            const tfile = resolve_tfile(selected_file);
                            const templateYamlColumns = await obtainColumnsFromFile(tfile);
                            // Merge columns with existing ones at the end
                            const new_columns = { ...view.diskConfig.yaml.columns };
                            let currentSize = columns.length;
                            let colsAdded = 0;
                            Object.entries(templateYamlColumns).forEach(([key, value]) => {
                                if (!new_columns[key]) {
                                    value.position = currentSize;
                                    new_columns[key] = value;
                                    currentSize++;
                                    colsAdded++;
                                }
                            });
                            view.diskConfig.yaml.columns = new_columns;
                            view.diskConfig.saveOnDisk();
                            new Notice(t("settings_template_file_notice_success_on_save", colsAdded.toString(), tfile.basename, currentSize.toString()), 1500);
                        });
                });

            /*********************************
             * TEMPLATE OF ALL POSSIBLE FIELDS
             *********************************/
            new Setting(template_section)
                .setName(t("settings_template_all_title"))
                .setDesc(t("settings_template_all_desc"))
                .addButton((button) => {
                    button.setIcon("save")
                        .setTooltip(t("settings_template_all_button_tooltip"))
                        .onClick(async (): Promise<void> => {
                            const recordColumns: Record<string, DatabaseColumn> = {};
                            const allColumns = await obtainColumnsFromRows(
                                view.file.parent.path,
                                view.diskConfig.yaml.config,
                                view.diskConfig.yaml.filters,
                                columns);

                            allColumns.forEach((key, index) => {
                                recordColumns[key] = {
                                    input: InputType.TEXT,
                                    accessorKey: key,
                                    label: key,
                                    key: key,
                                    id: key,
                                    position: index,
                                    config: DEFAULT_COLUMN_CONFIG,
                                }
                            })
                            view.diskConfig.yaml.columns = recordColumns;
                            view.diskConfig.saveOnDisk();
                            new Notice(t("settings_template_all_notice_success_on_save", Object.keys(columns).length.toString()), 1500);
                        });
                });
        }
        return this.goNext(settingHandlerResponse);
    }
}