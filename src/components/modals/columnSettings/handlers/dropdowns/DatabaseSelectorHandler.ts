import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { Setting } from "obsidian";
import { StringSuggest } from "settings/suggesters/StringSuggester";
import { recordAllDatabases } from "helpers/RelationHelper";
import { t } from "lang/helpers";

export class DatabaseSelectorHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = t("column_settings_modal_database_selector_title");
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
        const avaliableDDBB = recordAllDatabases();

        new Setting(containerEl)
            .setName(this.settingTitle)
            .setDesc(t("column_settings_modal_database_selector_desc"))
            .addSearch((cb) => {
                new StringSuggest(
                    cb.inputEl,
                    avaliableDDBB
                );
                cb.setPlaceholder(t("column_settings_modal_database_selector_placeholder"))
                    .setValue(column.config.related_note_path)
                    .onChange(database_selector_promise);
            });

        return this.goNext(columnHandlerResponse);
    }
}