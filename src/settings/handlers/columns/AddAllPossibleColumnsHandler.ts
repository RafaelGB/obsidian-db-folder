import { obtainColumnsFromRows } from "components/Columns";
import { Notice, Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";

export class AddAllPossibleColumnsHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Add all possible columns of the actual source';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { local, containerEl, view } = settingHandlerResponse;
        // Local exclusivey
        if (local) {
            new Setting(containerEl)
                .setName(this.settingTitle)
                .setDesc('Add all possible columns of the actual source')
                .addButton((button) => {
                    button.setIcon("create-new")
                        .setTooltip("Load columns from file")
                        .onClick(async (): Promise<void> => {
                            const columns = obtainColumnsFromRows(view.rows);
                            view.diskConfig.yaml.columns = columns;
                            view.diskConfig.saveOnDisk();
                            new Notice(`${Object.keys(columns).length} Columns were loaded from all fields avaliable in the current source! Close this dialog to show the database changes`);
                        });
                }
                );
        }
        return this.goNext(settingHandlerResponse);
    }
}