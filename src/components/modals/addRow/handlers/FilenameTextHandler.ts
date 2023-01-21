import { AddRowModalHandlerResponse } from "cdm/ModalsModel";
import { t } from "lang/helpers";
import { Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";

export class FilenameTextHandler extends AbstractHandlerClass<AddRowModalHandlerResponse> {
    settingTitle = t("add_row_modal_filename_text_title");
    textElId = "AddRowModalManager-addRow-input";
    handle(
        response: AddRowModalHandlerResponse
    ): AddRowModalHandlerResponse {
        const { containerEl, addRowModalManager } = response;
        const { dataState, columnsState, configState, table } = addRowModalManager.modal.state;
        let newFilename = "";
        const addNewRowPromise = async () => {
            await dataState.actions
                .addRow({
                    filename: newFilename,
                    columns: columnsState.info.getAllColumns(),
                    ddbbConfig: configState.info.getLocalSettings()
                }
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
            .setDesc(t("add_row_modal_filename_text_desc"))
            .addText(text => {
                text.inputEl.setAttribute("id", this.textElId);
                text.inputEl.onkeydown = (e: KeyboardEvent) => {
                    switch (e.key) {
                        case "Enter":
                            addNewRowPromise();
                            break;
                    }
                };
                text.setPlaceholder(t("add_row_modal_filename_text_placeholder"))
                    .setValue(newFilename)
                    .onChange(async (value: string): Promise<void> => {
                        newFilename = value;
                    });
            })
            .addButton((button) => {
                button
                    .setIcon("create-new")
                    .setTooltip(t("add_row_modal_filename_text_button_tooltip"))
                    .onClick(addNewRowPromise);
            });
        return this.goNext(response);
    }
}
