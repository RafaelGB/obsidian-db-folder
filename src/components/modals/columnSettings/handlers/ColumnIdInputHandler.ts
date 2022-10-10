import { Setting } from "obsidian";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";

export class ColumnIdInputHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
    settingTitle: string = 'Column id';
    handle(response: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = response;
        const { view } = columnSettingsManager.modal;
        // Check if media_settings is enabled
        new Setting(containerEl)
            .setName(this.settingTitle)
            .setDesc("Enter the column id of the column")
            .addText(text => {
                text.setPlaceholder("Write your nested key...")
                    .setValue(column.nestedId ?? column.id)
                    .onChange(async (value: string): Promise<void> => {
                        if (value && value !== column.id) {
                            const arrayId = value.split('.');
                            if (arrayId.length > 1) {
                                const rootId = arrayId.shift();
                                // Persist changes for complex key
                                await view.diskConfig.updateColumnProperties(column.key, {
                                    id: rootId,
                                    nestedId: arrayId.join('.')
                                });
                                // TODO alter notes id
                            } else {
                                // Persist changes for simple key
                                await view.diskConfig.updateColumnProperties(column.key, {
                                    id: value,
                                    nestedId: ''
                                });
                            }
                            columnSettingsManager.modal.enableReset = true;
                        }
                    })
            });


        return this.goNext(response);
    }
}