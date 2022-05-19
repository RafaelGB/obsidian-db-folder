import { Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";

export class MediaDimensionsHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Choose dimensions of embeded media';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { local, settingsManager, containerEl, view } = settingHandlerResponse;
        const media_settings = local ? view.diskConfig.yaml.config.media_settings : settingsManager.plugin.settings.local_settings.media_settings;
        if (media_settings.enable_media_view) {
            // Check if media_settings is enabled
            const dimensionSettings = new Setting(containerEl)
                .addText(text => {
                    text.setPlaceholder("Height")
                        .setValue(media_settings.height.toString())
                        .onChange(async (value: string): Promise<void> => {
                            // Common modifications of value
                            const parsedNumber = Number(value);
                            const validatedNumber = isNaN(parsedNumber) ? media_settings.height : parsedNumber;
                            media_settings.height = validatedNumber;
                            if (local) {
                                // Persist changes in local config
                                view.diskConfig.updateConfig('media_settings', media_settings);
                            } else {
                                // Persist changes in plugin settings
                                const update_local_settings = settingsManager.plugin.settings.local_settings;
                                update_local_settings.media_settings = media_settings;
                                await settingsManager.plugin.updateSettings({
                                    local_settings: update_local_settings
                                });
                            }
                        });
                }).addText(text => {
                    text.setPlaceholder("Width")
                        .setValue(media_settings.width.toString())
                        .onChange(async (value: string): Promise<void> => {
                            // Common modifications of value
                            const parsedNumber = Number(value);
                            const validatedNumber = isNaN(parsedNumber) ? media_settings.width : parsedNumber;
                            media_settings.width = validatedNumber;
                            if (local) {
                                // Persist changes in local config
                                view.diskConfig.updateConfig('media_settings', media_settings);
                            } else {
                                // Persist changes in plugin settings
                                const update_local_settings = settingsManager.plugin.settings.local_settings;
                                update_local_settings.media_settings = media_settings;
                                await settingsManager.plugin.updateSettings({
                                    local_settings: update_local_settings
                                });
                            }
                        });
                })
            if (local) {
                dimensionSettings.addExtraButton((cb) => {
                    cb.setIcon("reset")
                        .setTooltip("Restart default values")
                        .onClick(async (): Promise<void> => {
                            // Persist changes
                            media_settings.width = settingsManager.settings.local_settings.media_settings.width;
                            media_settings.height = settingsManager.settings.local_settings.media_settings.height;
                            view.diskConfig.updateConfig('media_settings', media_settings);
                        });
                });
            }
        }
        return this.goNext(settingHandlerResponse);
    }
}