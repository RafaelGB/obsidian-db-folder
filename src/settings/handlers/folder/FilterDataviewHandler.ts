import { OperatorFilter } from "helpers/Constants";
import { Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_button } from "settings/SettingsComponents";

export class FilterDataviewHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Add new filter';
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, view } = settingHandlerResponse;

        const filters = view.diskConfig.yaml.filters;
        const onClickAddPromise = async (): Promise<void> => {
            filters.push({
                field: '',
                operator: OperatorFilter.EQUAL,
                value: '',
            });
            // Persist changes
            view.diskConfig.updateFilters(filters);
            // Force refresh of settings
            settingsManager.reset(settingHandlerResponse);
        }
        add_button(
            containerEl,
            this.settingTitle,
            "Adds a new filter to the dataview query when the database is initialized",
            "+",
            "Adds an additional filter",
            onClickAddPromise
        );
        view.diskConfig.yaml.filters.forEach((filter, index) => {
            const filterSetting = new Setting(containerEl)
                .addText(text => {
                    text.setPlaceholder("name of field")
                        .setValue(filter.field)
                        .onChange(async (value: string): Promise<void> => {
                            filters[index].field = value;
                            // Persist changes
                            view.diskConfig.updateFilters(filters);
                            // Force refresh of settings
                            settingsManager.reset(settingHandlerResponse);
                        });
                }).addDropdown((dropdown) => {
                    Object.entries(OperatorFilter).forEach(([key, value]) => {
                        dropdown.addOption(value, key);
                    });
                    dropdown.setValue(filter.operator);
                    dropdown.onChange(async (value: string): Promise<void> => {
                        filters[index].operator = value;
                        // Persist changes
                        view.diskConfig.updateFilters(filters);
                        // Force refresh of settings
                        settingsManager.reset(settingHandlerResponse);
                    });
                });
            if (filter.value !== undefined) {
                filterSetting.addText(text => {
                    text.setPlaceholder("name of value")
                        .setValue(filter.value)
                        .onChange(async (value: string): Promise<void> => {
                            filters[index].value = value;
                            // Persist changes
                            view.diskConfig.updateFilters(filters);
                            // Force refresh of settings
                            settingsManager.reset(settingHandlerResponse);
                        });
                })
            }
            filterSetting.addExtraButton((cb) => {
                cb.setIcon("cross")
                    .setTooltip("Delete")
                    .onClick(async (): Promise<void> => {
                        filters.splice(index, 1);
                        // Persist changes
                        view.diskConfig.updateFilters(filters);
                        // Force refresh of settings
                        settingsManager.reset(settingHandlerResponse);
                    });
            });
        });
        return this.goNext(settingHandlerResponse);
    }
}