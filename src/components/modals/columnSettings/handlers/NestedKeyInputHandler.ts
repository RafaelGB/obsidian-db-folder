import { Setting } from "obsidian";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";

export class NestedKeyInputHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
    settingTitle: string = 'Nested key';
    handle(response: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = response;
        const { view } = columnSettingsManager.modal;
        const { config } = column
        if (config.isNested && !config.isInline) {
            // Check if media_settings is enabled
            new Setting(containerEl)
                .setName(this.settingTitle)
                .setDesc("Enter nested key (level1.level2.field)")
                .addText(text => {
                    text.setPlaceholder("Write your nested key...")
                        .setValue(config.nested_key?.toString())
                        .onChange(async (value: string): Promise<void> => {
                            // Persist changes in local config
                            await view.diskConfig.updateColumnConfig(column.key, {
                                nested_key: value
                            });
                            columnSettingsManager.modal.enableReset = true;
                        })
                });

        }
        return this.goNext(response);
    }
}