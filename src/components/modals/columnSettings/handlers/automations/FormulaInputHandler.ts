import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { Setting } from "obsidian";
import { add_toggle } from "settings/SettingsComponents";
export class FormulaInputHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = 'Formula properties';
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
            "Persist formula output",
            "Enable/disable to persist formula output on your notes (Only persisted formulas could be searchable and sortable)",
            column.config.persist_formula,
            persist_Formula_toggle_promise
        );

        new Setting(containerEl)
            .setName('Formula input')
            .setDesc('Enter your formula here using your js function names')
            .addTextArea((textArea) => {
                textArea.setValue(config.formula_query);
                textArea.setPlaceholder('Write here your formula');
                textArea.onChange(formula_promise);
                // style textarea size in function of formula length
                const formula_length = config.formula_query ? config.formula_query.length : 0;
                textArea.inputEl.rows = Math.max(4, formula_length / 30);
                textArea.inputEl.cols = Math.min(Math.max(10, formula_length * 2), 45);
                textArea.inputEl.style.width = 'auto';

            });
        const mainDesc = containerEl.createEl('p');

        mainDesc.appendText('Check our ');
        mainDesc.appendChild(
            createEl('a', {
                text: "documentation",
                href: "https://rafaelgb.github.io/obsidian-db-folder/features/Formulas/",
            })
        );

        mainDesc.appendText(' for more information about how to use formulas');
        return this.goNext(columnHandlerResponse);
    }
}