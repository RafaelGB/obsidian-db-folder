import { obtainColumnsFromFile } from "components/Columns";
import { Setting } from "obsidian";
import { DataviewService } from "services/DataviewService";
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
            app.vault.getMarkdownFiles()
                .filter(file => file.path.startsWith(view.file.parent.path))
                .forEach(file => { filePaths[file.path] = file.basename });
            DataviewService.getDataviewAPI().pages
            new Setting(containerEl)
                .setName(this.settingTitle)
                .setDesc('Select file to use as template for database columns')
                .addDropdown((dropdown) => {
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
                        });
                });
        }
        return this.goNext(settingHandlerResponse);
    }
}