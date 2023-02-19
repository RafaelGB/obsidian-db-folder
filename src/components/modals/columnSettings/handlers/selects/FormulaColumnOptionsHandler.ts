import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { OptionSource } from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import { t } from "lang/helpers";
import { Notice, Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { Db } from "services/CoreService";
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
                    cb.setIcon("reset")
                        .setTooltip("column_settings_modal_formula_option_source_placeholder")
                        .onClick(async (): Promise<void> => {
                            try {
                                column.config.formula_option_source = currentFormula;
                                columnHandlerResponse.column.options = FormulaService.evalOptionsWith(column, automationState.info.getFormulas());
                            } catch (e) {
                                new Notice("Error in formula: " + e);
                                return;
                            }
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
            // Label-Value pairs table
            const tableEl = containerEl.createEl("table");
            const thead = tableEl.createEl("thead");
            const tr = thead.createEl("tr");
            tr.createEl("th", {
                text: "Label",
            });
            tr.createEl("th", {
                text: "Value",
            });
            const tbody = tableEl.createEl("tbody");
            // Show column options read-only
            columnHandlerResponse.column.options.forEach((option) => {
                const tr = tbody.createEl("tr");
                tr.addClass(c("center-cell"));
                tr.style.backgroundColor = option.color;
                tr.style.color = Db.coreFns.colors.getContrast(option.color);
                // td centering text
                tr.createEl("td", {
                    text: option.label,
                });
                tr.createEl("td", {
                    text: option.value,
                });
            });
        }
        return this.goNext(columnHandlerResponse);
    }

}
