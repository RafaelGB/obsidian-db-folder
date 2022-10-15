import { Setting } from "obsidian";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";

export class MediaDimensionsHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
    settingTitle: string = 'Dimensions of embeded media';
    handle(response: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = response;
        const { view } = columnSettingsManager.modal;
        const dbSettings = view.plugin.settings;
        const { config } = column
        if (config.enable_media_view) {
            // Check if media_settings is enabled
            new Setting(containerEl)
                .setName(this.settingTitle)
                .setDesc("Choose dimensions of embeded media (heigthxwidth)")
                .addText(text => {
                    text.setPlaceholder("Height")
                        .setValue(config.media_height.toString())
                        .onChange(async (value: string): Promise<void> => {
                            // Common modifications of value
                            const parsedNumber = Number(value);
                            const validatedNumber = isNaN(parsedNumber) ? config.media_height : parsedNumber;
                            config.media_height = validatedNumber;
                            // Persist changes in local config
                            await view.diskConfig.updateColumnConfig(column.id, {
                                media_height: validatedNumber
                            });
                            columnSettingsManager.modal.enableReset = true;
                        })
                }).addText(text => {
                    text.setPlaceholder("Width")
                        .setValue(config.media_width.toString())
                        .onChange(async (value: string): Promise<void> => {
                            // Common modifications of value
                            const parsedNumber = Number(value);
                            const validatedNumber = isNaN(parsedNumber) ? config.media_width : parsedNumber;
                            // Persist changes in local config
                            view.diskConfig.updateColumnConfig(column.id, {
                                media_width: validatedNumber
                            });
                        })
                }).addExtraButton((cb) => {
                    cb.setIcon("reset")
                        .setTooltip("Restart default values")
                        .onClick(async (): Promise<void> => {
                            // Persist change
                            view.diskConfig.updateColumnConfig(column.id, {
                                media_width: dbSettings.global_settings.media_settings.width,
                                media_height: dbSettings.global_settings.media_settings.height
                            });
                            // Force refresh of settings
                            columnSettingsManager.reset(response);
                        });
                });

        }
        return this.goNext(response);
    }
}