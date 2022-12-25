import { DEFAULT_COLUMN_CONFIG } from "helpers/Constants";
import { t } from "lang/helpers";
import { Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";

export class MediaDimensionsHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_media_dimension_title");
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl } = settingHandlerResponse;
        const media_settings = settingsManager.plugin.settings.global_settings.media_settings;
        if (media_settings.enable_media_view) {
            // Check if media_settings is enabled
            const dimensionSettings = new Setting(containerEl)
                .setName(this.settingTitle)
                .setDesc(t("settings_media_dimension_desc"))
                .addText(text => {
                    text.setPlaceholder(t("settings_media_dimension_height"))
                        .setValue(media_settings.height.toString())
                        .onChange(async (value: string): Promise<void> => {
                            // Common modifications of value
                            const parsedNumber = Number(value);
                            const validatedNumber = isNaN(parsedNumber) ? media_settings.height : parsedNumber;
                            media_settings.height = validatedNumber;

                            // Persist changes in plugin settings
                            const update_global_settings = settingsManager.plugin.settings.global_settings;
                            update_global_settings.media_settings = media_settings;
                            await settingsManager.plugin.updateSettings({
                                global_settings: update_global_settings
                            });

                        });
                }).addText(text => {
                    text.setPlaceholder(t("settings_media_dimension_width"))
                        .setValue(media_settings.width.toString())
                        .onChange(async (value: string): Promise<void> => {
                            // Common modifications of value
                            const parsedNumber = Number(value);
                            const validatedNumber = isNaN(parsedNumber) ? media_settings.width : parsedNumber;
                            media_settings.width = validatedNumber;
                            // Persist changes in plugin settings
                            const update_global_settings = settingsManager.plugin.settings.global_settings;
                            update_global_settings.media_settings = media_settings;
                            await settingsManager.plugin.updateSettings({
                                global_settings: update_global_settings
                            });

                        });
                })
            dimensionSettings.addExtraButton((cb) => {
                cb.setIcon("reset")
                    .setTooltip(t("settings_default_values"))
                    .onClick(async (): Promise<void> => {
                        const update_global_settings = settingsManager.plugin.settings.global_settings;
                        // Persist changes
                        update_global_settings.media_settings.width = DEFAULT_COLUMN_CONFIG.media_width
                        update_global_settings.media_settings.height = DEFAULT_COLUMN_CONFIG.media_height;
                        await settingsManager.plugin.updateSettings({
                            global_settings: update_global_settings
                        });
                        // Force refresh of settings
                        settingsManager.reset(settingHandlerResponse);
                    });

            });
            return this.goNext(settingHandlerResponse);
        }
    }
}