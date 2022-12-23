import { Setting } from "obsidian";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { t } from "lang/helpers";

export class MediaDimensionsHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
    settingTitle: string = t("column_settings_modal_media_dimension_title");
    handle(response: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = response;
        const { view } = columnSettingsManager.modal;
        const dbSettings = view.plugin.settings;
        const { config } = column
        if (config.enable_media_view) {
            // Check if media_settings is enabled
            new Setting(containerEl)
                .setName(this.settingTitle)
                .setDesc(t("column_settings_modal_media_dimension_desc"))
                .addText(text => {
                    text.setPlaceholder(t("column_settings_modal_media_dimension_placeholder_height"))
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
                    text.setPlaceholder(t("column_settings_modal_media_dimension_placeholder_width"))
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
                        .setTooltip(t("column_settings_modal_media_dimension_button_tooltip"))
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