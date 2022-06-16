import { RowDataType } from "cdm/FolderModel";
import { obtainColumnsFromFile } from "components/Columns";
import { Notice, Setting } from "obsidian";
import { VaultManagerDB } from "services/FileManagerService";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";

export class UseFileFieldsAsTemplateColumnsHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Select file as columns template';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { local, containerEl, view } = settingHandlerResponse;
        let selected_file: string = "";
        // Local exclusivey
        if (local) {
            const filePaths: Record<string, string> = {};
            view.rows.forEach((row: RowDataType) => {
                if (row.__note__) {
                    filePaths[row.__note__.getFile().path] = row.__note__.getFile().basename;
                }
            });
            new Setting(containerEl)
                .setName(this.settingTitle)
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
                            const tfile = VaultManagerDB.obtainTfileFromFilePath(selected_file);
                            const columns = await obtainColumnsFromFile(tfile);
                            view.diskConfig.yaml.columns = columns;
                            view.diskConfig.saveOnDisk();
                            new Notice(`${Object.keys(columns).length} Columns were loaded from file "${tfile.basename}"! Close this dialog to show the database changes`);
                        });
                });
        }
        return this.goNext(settingHandlerResponse);
    }
}