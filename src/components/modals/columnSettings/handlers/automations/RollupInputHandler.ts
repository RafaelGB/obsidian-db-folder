import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { Setting } from "obsidian";
import { add_toggle } from "settings/SettingsComponents";
import { StringSuggest } from "settings/suggesters/StringSuggester";
import { InputType, ROLLUP_ACTIONS } from "helpers/Constants";
import { recordFieldsFromRelation } from "helpers/RelationHelper";
export class RollupInputHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = 'rollup properties';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view, columnsState, configState } = columnSettingsManager.modal;
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
            .setName("Select relation column")
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
        // select rollup action
        const rollup_action_options: Record<string, string> = {};
        Object.entries(ROLLUP_ACTIONS).forEach(([key, value]) => {
            rollup_action_options[key] = value;
        });
        const rollup_action_promise = async (value: string): Promise<void> => {
            // Persist on disk
            await view.diskConfig.updateColumnConfig(column.id, {
                rollup_action: value
            });
            columnSettingsManager.modal.enableReset = true;
        };
        new Setting(containerEl)
            .setName("Select action")
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
        // TODO select key column (if action allows it)
        const rollup_key_promise = async (value: string): Promise<void> => {
            // Persist on disk
            await view.diskConfig.updateColumnConfig(column.id, {
                rollup_key: value
            });
            columnSettingsManager.modal.enableReset = true;
        };
        recordFieldsFromRelation("Incidencias/ropa/clothing ddbb.md", configState.info.getLocalSettings()).then((fields) => {
            new Setting(containerEl)
                .setName("Select property of relation")
                .setDesc('Select the property to rollup from the relation')
                .addSearch((cb) => {
                    new StringSuggest(
                        cb.inputEl,
                        fields
                    );
                    cb.setPlaceholder("Select property...")
                        .setValue(column.config.rollup_key)
                        .onChange(rollup_key_promise);
                });
            // Enable persist rollup toggle
            add_toggle(
                containerEl,
                "Persist rollup output",
                "Enable/disable to persist rollup output on your notes (Only persisted rollups could be searchable and sortable)",
                config.persist_rollup,
                persist_rollup_toggle_promise
            );

            return this.goNext(columnHandlerResponse);
        });
        return null;
    }
}