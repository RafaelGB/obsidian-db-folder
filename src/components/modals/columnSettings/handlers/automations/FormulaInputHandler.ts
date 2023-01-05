import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { Setting } from "obsidian";
import { add_toggle } from "settings/SettingsComponents";
import { t } from "lang/helpers";
import { c } from "helpers/StylesHelper";
export class FormulaInputHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle = 'Formula properties';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        const { config } = column

        const formula_promise = async (value: string) => {
            // Persist value
            await view.diskConfig.updateColumnConfig(column.id, {
                formula_query: value
            });
            columnSettingsManager.modal.enableReset = true;
        }

        const persist_Formula_toggle_promise = async (value: boolean): Promise<void> => {
            column.config.link_alias_enabled = value;
            // Persist value
            await view.diskConfig.updateColumnConfig(column.id, {
                persist_formula: value
            });
            columnSettingsManager.modal.enableReset = true;
        }
        add_toggle(
            containerEl,
            t("column_settings_modal_formula_input_persist_toggle_title"),
            t("column_settings_modal_formula_input_persist_toggle_desc"),
            column.config.persist_formula,
            persist_Formula_toggle_promise
        );

        new Setting(containerEl)
            .setName(t("column_settings_modal_formula_input_textarea_title"))
            .setDesc(t("column_settings_modal_formula_input_textarea_desc"))
            .addTextArea((textArea) => {
                textArea.setValue(config.formula_query);
                textArea.setPlaceholder(t("column_settings_modal_formula_input_textarea_placeholder"));
                textArea.onChange(formula_promise);
                textArea.inputEl.addClass(c("textarea-setting"));
                textArea.inputEl.onkeydown = (e: KeyboardEvent) => {
                    switch (e.key) {
                        case "Enter":
                            e.preventDefault();
                            break;
                    }
                };

            });
        const mainDesc = containerEl.createEl('p');

        mainDesc.appendChild(
            createEl('a', {
                text: t("column_settings_modal_formula_input_textarea_docu_link_text"),
                href: "https://rafaelgb.github.io/obsidian-db-folder/features/Formulas/",
            })
        );
        return this.goNext(columnHandlerResponse);
    }
}