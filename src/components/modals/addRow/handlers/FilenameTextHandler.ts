import { AddRowModalHandlerResponse } from "cdm/ModalsModel";
import { Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/AbstractHandler";

export class FilenameTextHandler extends AbstractHandlerClass<AddRowModalHandlerResponse> {
    settingTitle: string = "Filename";
    textElId: string = "AddRowModalManager-addRow-input";
    handle(
        response: AddRowModalHandlerResponse
    ): AddRowModalHandlerResponse {
        const { containerEl, addRowModalManager } = response;
        const { dataState, columnsState, configState, table } = addRowModalManager.modal.state;
        let newFilename = "";
        const addNewRowPromise = async () => {
            await dataState.actions
                .addRow(
                    newFilename,
                    columnsState.info.getAllColumns(),
                    configState.info.getLocalSettings()
                );
            newFilename = "";
            (activeDocument.getElementById(this.textElId) as HTMLInputElement).value = "";
            table.setPageIndex(table.getPageCount() - 1);

        }

        /**************
         * EMPTY COLUMN
         **************/
        new Setting(containerEl)
            .setName(this.settingTitle)
            .setDesc("Filename associated with the new row")
            .addText(text => {
                text.inputEl.setAttribute("id", this.textElId);
                text.inputEl.onkeydown = (e: KeyboardEvent) => {
                    switch (e.key) {
                        case "Enter":
                            addNewRowPromise();
                            break;
                    }
                };
                text.setPlaceholder("Enter filename")
                    .setValue(newFilename)
                    .onChange(async (value: string): Promise<void> => {
                        newFilename = value;
                    });
            })
            .addButton((button) => {
                button
                    .setIcon("create-new")
                    .setTooltip("Add new row")
                    .onClick(addNewRowPromise);
            });
        return this.goNext(response);
    }
}
