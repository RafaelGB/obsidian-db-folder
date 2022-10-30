import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { Setting } from "obsidian";
import { StringSuggest } from "settings/suggesters/StringSuggester";
import { ROLLUP_ACTIONS } from "helpers/Constants";
export class RollupActionHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = 'Select action';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        // select rollup action
        const rollup_action_options: Record<string, string> = {};
        Object.values(ROLLUP_ACTIONS).forEach((action) => {
            rollup_action_options[action] = action;
        });

        const rollup_action_promise = async (value: string): Promise<void> => {
            // Persist on disk
            await view.diskConfig.updateColumnConfig(column.id, {
                rollup_action: value
            });
            columnSettingsManager.modal.enableReset = true;
        };

        new Setting(containerEl)
            .setName(this.settingTitle)
            .setDesc('Select the action to perform on the rollup')
            .addSearch((cb) => {
                new StringSuggest(
                    cb.inputEl,
                    rollup_action_options
                );
                cb.setPlaceholder("Select action...")
                    .setValue(column.config.rollup_action)
                    .onChange(rollup_action_promise);
            });
        return this.goNext(columnHandlerResponse);
    }
}