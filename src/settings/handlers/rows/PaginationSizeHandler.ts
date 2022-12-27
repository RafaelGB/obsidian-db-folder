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
        const { local, containerEl, view } = settingHandlerResponse;
        if (local) {
            const pagination_size_promise = async (value: number): Promise<void> => {
                // update settings
                view.diskConfig.updateConfig({ pagination_size: value });
            };
            // Local settings support
            new Setting(containerEl)
                .setName(this.settingTitle)
                .setDesc(t("settings_pagination_size_desc"))
                .addSlider((slider) => {
                    this.slider = slider;
                    slider.setDynamicTooltip()
                        .setValue(view.diskConfig.yaml.config.pagination_size)
                        .setLimits(LIMITS.MIN, LIMITS.MAX, LIMITS.STEP)
                        .onChange(pagination_size_promise);
                }).addExtraButton((cb) => {
                    cb.setIcon("reset")
                        .setTooltip(t("settings_default_values"))
                        .onClick(async (): Promise<void> => {
                            view.diskConfig.updateConfig({ font_size: DEFAULT_SETTINGS.local_settings.pagination_size });
                            this.slider.setValue(DEFAULT_SETTINGS.local_settings.pagination_size);
                        });
                });
        }
        return this.goNext(settingHandlerResponse);
    }
}