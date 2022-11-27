import { AddRowModalHandlerResponse } from "cdm/ModalsModel";
import { Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { StringSuggest } from "settings/suggesters/StringSuggester";

export class TemplateDropdownHandler extends AbstractHandlerClass<AddRowModalHandlerResponse> {
    settingTitle: string = "Row Template";
    handle(
        response: AddRowModalHandlerResponse
    ): AddRowModalHandlerResponse {
        const { containerEl, addRowModalManager } = response;
        const { rowTemplate } = addRowModalManager.modal.state;

        const avaliableOptions: Record<string, string> = {};
        rowTemplate.options.forEach((option) => {
            avaliableOptions[option.label] = option.value;
        });

        const updateTemplatHandler = async (value: string): Promise<void> => {
            rowTemplate.update(value);
        }

        new Setting(containerEl)
            .setName(this.settingTitle)
            .setDesc('Select from the existing templates to create a new row. The list is related with template folder setting. Leave empty to create an empty file.')
            .addSearch((cb) => {
                new StringSuggest(
                    cb.inputEl,
                    avaliableOptions
                );
                cb.setPlaceholder("Select a template...")
                    .setValue(rowTemplate.template)
                    .onChange(updateTemplatHandler);
            });

        return this.goNext(response);
    }
}
