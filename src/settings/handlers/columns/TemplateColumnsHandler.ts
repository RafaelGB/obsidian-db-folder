import { RowDataType } from "cdm/FolderModel";
import { obtainColumnsFromFile, obtainColumnsFromRows } from "components/Columns";
import { resolve_tfile } from "helpers/FileManagement";
import { Notice, Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_setting_header } from "settings/SettingsComponents";

export class TemplateColumnsHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Header templates';
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
                .setName('Select file as columns template')
                .setDesc('Select file to use as template for database columns. Click the button to apply the template.')
                .addDropdown((dropdown) => {
                    dropdown
                    dropdown.addOptions(filePaths);
                    dropdown.setValue("-");
                    dropdown.onChange((value: string) => {
                        selected_file = value;
                    });
                }).addExtraButton((cb) => {
                    cb.setIcon("create-new")
                        .setTooltip("Load columns from file")
                        .onClick(async (): Promise<void> => {
                            const tfile = resolve_tfile(selected_file);
                            const columns = await obtainColumnsFromFile(tfile);
                            view.diskConfig.yaml.columns = columns;
                            view.diskConfig.saveOnDisk();
                            new Notice(`${Object.keys(columns).length} Columns were loaded from file "${tfile.basename}"! Close this dialog to show the database changes`);
                        });
                });

            /*********************************
             * TEMPLATE OF ALL POSSIBLE FIELDS
             *********************************/
            new Setting(template_section)
                .setName('Use all fields')
                .setDesc('Add all possible columns of your actual source of the database')
                .addButton((button) => {
                    button.setIcon("create-new")
                        .setTooltip("Load columns from file")
                        .onClick(async (): Promise<void> => {
                            const allColumns = await obtainColumnsFromRows(
                                view,
                                view.diskConfig.yaml.config,
                                view.diskConfig.yaml.filters,
                                columns);
                            view.diskConfig.yaml.columns = allColumns;
                            view.diskConfig.saveOnDisk();
                            new Notice(`${Object.keys(columns).length} Columns were loaded from all fields avaliable in the current source! Close this dialog to show the database changes`);
                        });
                });
        }
        return this.goNext(settingHandlerResponse);
    }
}