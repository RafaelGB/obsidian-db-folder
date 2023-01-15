import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { Setting } from "obsidian";
import { t } from "lang/helpers";
import { c } from "helpers/StylesHelper";
import { ROLLUP_ACTIONS } from "helpers/Constants";
export class RollupFormulaHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle = 'Formula properties';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        const { config } = column

        // Allow formula query only if rollup action is formula
        if (config.rollup_action === ROLLUP_ACTIONS.FORMULA) {
            const formula_promise = async (value: string) => {
                // Persist value
                await view.diskConfig.updateColumnConfig(column.id, {
                    formula_query: value
                });
                columnSettingsManager.modal.enableReset = true;
            }

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
        }

        return this.goNext(columnHandlerResponse);
    }
}