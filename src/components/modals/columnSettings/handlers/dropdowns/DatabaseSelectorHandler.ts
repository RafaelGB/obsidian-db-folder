import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { Setting } from "obsidian";
import { StringSuggest } from "settings/suggesters/StringSuggester";
import { recordAllDatabases } from "helpers/RelationHelper";

export class DatabaseSelectorHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = 'Select another table to relate with';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        // pass if modal opened from local settings
        const database_selector_promise = async (value: string): Promise<void> => {
            column.config.related_note_path = value;
            // Persist value
            await view.diskConfig.updateColumnConfig(column.id, {
                related_note_path: value
            });
            columnSettingsManager.modal.enableReset = true;
        }
        const avaliableDDBB = recordAllDatabases(view.file.path);

        new Setting(containerEl)
            .setName(this.settingTitle)
            .setDesc('Select from the existing tables to relate with the current column')
            .addSearch((cb) => {
                new StringSuggest(
                    cb.inputEl,
                    avaliableDDBB
                );
                cb.setPlaceholder("Search Relation...")
                    .setValue(column.config.related_note_path)
                    .onChange(database_selector_promise);
            });

        return this.goNext(columnHandlerResponse);
    }
}