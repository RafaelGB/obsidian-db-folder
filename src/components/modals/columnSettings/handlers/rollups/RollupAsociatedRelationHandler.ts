import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { Setting } from "obsidian";
import { StringSuggest } from "settings/suggesters/StringSuggester";
import { InputType } from "helpers/Constants";
export class RollupAsociatedRelationHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = 'Select relation column';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view, columnsState } = columnSettingsManager.modal;
        const { config } = column
        const allColumns = columnsState.info.getAllColumns();
        // Select relation from existing columns
        const avaliableRelations: Record<string, string> = {};
        allColumns
            .filter((col) => col.input === InputType.RELATION && col.config.related_note_path)
            .forEach((col) => {
                avaliableRelations[col.id] = col.label;
            });
        const relation_selector_promise = async (value: string): Promise<void> => {
            if (config.asociated_relation_id !== value) {
                config.asociated_relation_id = value;
                // Persist on disk
                await view.diskConfig.updateColumnConfig(column.id, {
                    asociated_relation_id: value
                });
                columnSettingsManager.modal.enableReset = true;
                // re-render column settings
                columnSettingsManager.reset(columnHandlerResponse);
            }
        };

        new Setting(containerEl)
            .setName(this.settingTitle)
            .setDesc('Select from the existing columns to rollup')
            .addSearch((cb) => {
                new StringSuggest(
                    cb.inputEl,
                    avaliableRelations
                );
                cb.setPlaceholder("Search Relation...")
                    .setValue(config.asociated_relation_id)
                    .onChange(relation_selector_promise);
            });
        return this.goNext(columnHandlerResponse);
    }
}