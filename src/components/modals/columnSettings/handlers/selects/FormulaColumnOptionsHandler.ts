import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { OptionSource } from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import { t } from "lang/helpers";
import { Notice, Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { FormulaService } from "services/FormulaService";

export class FormulaColumnOptionsHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
    settingTitle = t("column_settings_modal_formula_option_source_title");
    handle(
        columnHandlerResponse: ColumnSettingsHandlerResponse
    ): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } =
            columnHandlerResponse;

        const { view, automationState } = columnSettingsManager.modal;
        const { config } = column;

        if (column.config.option_source === OptionSource.FORMULA) {
            let currentFormula = config.formula_option_source;
            const formula_promise = async (formula: string): Promise<void> => {
                currentFormula = formula;
            };
            new Setting(containerEl)
                .setName("Formula for column options")
                .setDesc(t("column_settings_modal_formula_option_source_desc"))
                .setClass(c("setting-item"))
                .addTextArea((textArea) => {
                    textArea.setValue(currentFormula);
                    textArea.setPlaceholder("I.E.: [{value: 'a', label: 'A' color: 'red'}, {value: 'b', label: 'B' color: 'blue'}]");
                    textArea.inputEl.addClass(c("textarea-setting"));
                    textArea.onChange(formula_promise);
                }).addExtraButton((cb) => {
                    cb.setIcon("pencil")
                        .setTooltip("column_settings_modal_formula_option_source_placeholder")
                        .onClick(async (): Promise<void> => {
                            if (currentFormula === config.formula_option_source) {
                                new Notice("No changes were made", 1500);
                                return;
                            }
                            columnHandlerResponse.column.options = FormulaService.evalOptionsWith(column, automationState.info.getFormulas());
                            columnHandlerResponse.column.config.formula_option_source = currentFormula;
                            // Persist changes
                            await view.diskConfig.updateColumnConfig(column.id, {
                                formula_option_source: columnHandlerResponse.column.config.formula_option_source
                            });

                            await view.diskConfig.updateColumnProperties(column.id, {
                                options: columnHandlerResponse.column.options
                            });
                            // Reset column settings
                            columnSettingsManager.reset(columnHandlerResponse);
                        });
                });
            const mainDesc = containerEl.createEl('p');

            mainDesc.appendChild(
                createEl('a', {
                    text: t("column_settings_modal_formula_input_textarea_docu_link_text"),
                    href: "https://rafaelgb.github.io/obsidian-db-folder/features/Formulas/",
                })
            );
            // TODO Show column options read-only
            columnHandlerResponse.column.options.forEach((option) => {
                const optionEl = containerEl.createDiv();
                optionEl.style.backgroundColor = option.color;
                optionEl.addClass(c("readable-options"));
                optionEl.createDiv({ text: option.label });
                optionEl.createDiv({ text: option.value });

            });
        }
        return this.goNext(columnHandlerResponse);
    }

}
