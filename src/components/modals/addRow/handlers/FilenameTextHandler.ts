import { AddRowModalHandlerResponse } from "cdm/ModalsModel";
import { Notice, Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/AbstractHandler";

export class FilenameTextHandler extends AbstractHandlerClass<AddRowModalHandlerResponse> {
    settingTitle: string = "Add Row";
    handle(
        response: AddRowModalHandlerResponse
    ): AddRowModalHandlerResponse {
        const { containerEl, addRowModalManager } = response;

        let newColumnName = "";
        const addNewROWPromise = async () => {
        }

        /**************
         * EMPTY COLUMN
         **************/
        new Setting(containerEl)
            .setName(this.settingTitle)
            .setDesc("Add a new file associated with a row")
            .addText(text => {
                text.inputEl.setAttribute("id", "AddRowModalManager-addRow-input");
                text.inputEl.onkeydown = (e: KeyboardEvent) => {
                    switch (e.key) {
                        case "Enter":
                            addNewROWPromise();
                            break;
                    }
                };
                text.setPlaceholder("Enter filename")
                    .setValue(newColumnName)
                    .onChange(async (value: string): Promise<void> => {
                        newColumnName = value;
                    });
            })
            .addButton((button) => {
                button
                    .setIcon("create-new")
                    .setTooltip("Add new row")
                    .onClick(addNewROWPromise);
            });
        return this.goNext(response);
    }
}
