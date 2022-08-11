import { OperatorFilter } from "helpers/Constants";
import { Setting } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";
import { add_button } from "settings/SettingsComponents";

export class FilterDataviewHandler extends AbstractSettingsHandler {
    settingTitle: string = 'Add new filter';
    handle(response: SettingHandlerResponse): SettingHandlerResponse {
        const { settingsManager, containerEl, view } = response;


        const filters = view.diskConfig.yaml.filters.conditions;
        const onClickAddPromise = async (): Promise<void> => {
            filters.push({
                field: '',
                operator: OperatorFilter.EQUAL,
                value: '',
            });
            // Persist changes
            view.diskConfig.updateFilters({ conditions: filters });
            // Force refresh of settings
            settingsManager.reset(response);
        }
        add_button(
            containerEl,
            this.settingTitle,
            "Adds a new filter to the dataview query when the database is initialized",
            "+",
            "Adds an additional filter",
            onClickAddPromise
        );
        view.diskConfig.yaml.filters.conditions.forEach((condition, index) => {
            new Setting(containerEl)
                .addText(text => {
                    text.setPlaceholder("name of field")
                        .setValue(condition.field)
                        .onChange(async (value: string): Promise<void> => {
                            filters[index].field = value;
                            // Persist changes
                            view.diskConfig.updateFilters({ conditions: filters });
                        });
                }).addDropdown((dropdown) => {
                    Object.entries(OperatorFilter).forEach(([key, value]) => {
                        dropdown.addOption(key, value);
                    });
                    dropdown.setValue(condition.operator);
                    dropdown.onChange(async (value: string): Promise<void> => {
                        filters[index].operator = value;
                        // Persist changes
                        view.diskConfig.updateFilters({ conditions: filters });
                    });
                }).addText(text => {
                    text.setPlaceholder("name of value")
                        .setValue(`${condition.value}`)
                        .onChange(async (value: string): Promise<void> => {
                            filters[index].value = value;
                            // Persist changes
                            view.diskConfig.updateFilters({ conditions: filters });
                        });
                }).addExtraButton((cb) => {
                    cb.setIcon("cross")
                        .setTooltip("Delete")
                        .onClick(async (): Promise<void> => {
                            filters.splice(index, 1);
                            // Persist changes
                            await view.diskConfig.updateFilters({ conditions: filters });
                            // Force refresh of settings
                            settingsManager.reset(response);
                        });
                });
        });
        return this.goNext(response);
    }
}