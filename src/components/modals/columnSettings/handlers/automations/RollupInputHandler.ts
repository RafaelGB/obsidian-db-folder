import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { Setting } from "obsidian";
import { add_toggle } from "settings/SettingsComponents";
import { StringSuggest } from "settings/suggesters/StringSuggester";
import { InputType } from "helpers/Constants";
export class RollupInputHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = 'rollup properties';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view, columnsState } = columnSettingsManager.modal;
        const { config } = column

        const persist_rollup_toggle_promise = async (value: boolean): Promise<void> => {
            // Persist value
            await view.diskConfig.updateColumnConfig(column.id, {
                persist_rollup: value
            });
            columnSettingsManager.modal.enableReset = true;
        }
        // Select relation from existing columns
        const avaliableRelations: Record<string, string> = {};
        columnsState.info.getAllColumns()
            .filter((col) => col.input === InputType.RELATION && col.config.related_note_path)
            .forEach((col) => {
                avaliableRelations[col.id] = col.label;
            });
        const relation_selector_promise = async (value: string): Promise<void> => {
            config.asociated_relation_id = value;
            // Persist value
            await view.diskConfig.updateColumnConfig(column.id, {
                rollup_relation: value
            });
            columnSettingsManager.modal.enableReset = true;
        };
        new Setting(containerEl)
            .setName("Select relation to rollup")
            .setDesc('Select from the existing columns to rollup')
            .addSearch((cb) => {
                new StringSuggest(
                    cb.inputEl,
                    avaliableRelations
                );
                cb.setPlaceholder("Search Relation...")
                    .setValue(column.config.asociated_relation_id)
                    .onChange(relation_selector_promise);
            });
        // TODO select rollup action
        // TODO select key column (if action allows it)
        // Enable persist rollup toggle
        add_toggle(
            containerEl,
            "Persist rollup output",
            "Enable/disable to persist rollup output on your notes (Only persisted rollups could be searchable and sortable)",
            config.persist_rollup,
            persist_rollup_toggle_promise
        );

        return this.goNext(columnHandlerResponse);
    }
}