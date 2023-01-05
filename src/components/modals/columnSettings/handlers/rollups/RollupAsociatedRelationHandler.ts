import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { Setting } from "obsidian";
import { StringSuggest } from "settings/suggesters/StringSuggester";
import { InputType } from "helpers/Constants";
import { t } from "lang/helpers";
export class RollupAsociatedRelationHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = t("column_settings_modal_rollup_associated_relation_title");
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
            .setDesc(t("column_settings_modal_rollup_associated_relation_desc"))
            .addSearch((cb) => {
                new StringSuggest(
                    cb.inputEl,
                    avaliableRelations
                );
                cb.setPlaceholder(t("column_settings_modal_rollup_associated_relation_placeholder"))
                    .setValue(config.asociated_relation_id)
                    .onChange(relation_selector_promise);
            });
        return this.goNext(columnHandlerResponse);
    }
}