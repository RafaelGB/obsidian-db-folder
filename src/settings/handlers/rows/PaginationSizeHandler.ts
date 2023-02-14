import { DEFAULT_SETTINGS } from "helpers/Constants";
import { t } from "lang/helpers";
import { Setting, SliderComponent } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";

const LIMITS = Object.freeze({
    MIN: 10,
    MAX: 200,
    STEP: 5,
});

export class PaginationSizeHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_pagination_size_title");
    slider: SliderComponent;
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { local, containerEl, view, settingsManager } = settingHandlerResponse;

        const pagination_size_promise = async (value: number): Promise<void> => {
            if (local) {
                // update settings
                view.diskConfig.updateConfig({ pagination_size: value });
            } else {
                // set debug mode
                const update_local_settings = settingsManager.plugin.settings.local_settings;
                update_local_settings.pagination_size = value;
                // update settings
                await settingsManager.plugin.updateSettings({
                    local_settings: update_local_settings
                });
            }
        };
        // Local settings support
        new Setting(containerEl)
            .setName(this.settingTitle)
            .setDesc(t("settings_pagination_size_desc"))
            .addSlider((slider) => {
                this.slider = slider;
                slider.setDynamicTooltip()
                    .setLimits(LIMITS.MIN, LIMITS.MAX, LIMITS.STEP)
                    .setValue(
                        local ?
                            view.diskConfig.yaml.config.pagination_size :
                            settingsManager.plugin.settings.local_settings.pagination_size
                    )
                    .onChange(pagination_size_promise);
            }).addExtraButton((cb) => {
                cb.setIcon("reset")
                    .setTooltip(t("settings_default_values"))
                    .onClick(async (): Promise<void> => {
                        if (local) {
                            view.diskConfig.updateConfig({ font_size: DEFAULT_SETTINGS.local_settings.pagination_size });
                        } else {
                            // set debug mode
                            const update_local_settings = settingsManager.plugin.settings.local_settings;
                            update_local_settings.pagination_size = DEFAULT_SETTINGS.local_settings.pagination_size;
                            // update settings
                            await settingsManager.plugin.updateSettings({
                                local_settings: update_local_settings
                            });
                        }
                        this.slider.setValue(DEFAULT_SETTINGS.local_settings.pagination_size);
                    });
            });

        return this.goNext(settingHandlerResponse);
    }
}