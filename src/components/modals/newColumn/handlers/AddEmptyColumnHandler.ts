import { AddColumnModalHandlerResponse } from "cdm/ModalsModel";
import { MetadataColumns } from "helpers/Constants";
import { Notice, Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/AbstractHandler";

export class AddEmptyColumnHandler extends AbstractHandlerClass<AddColumnModalHandlerResponse> {
  settingTitle: string = "Add empty column";
  textElId: string = "SettingsModalManager-addEmptyColumn-input";
  handle(
    response: AddColumnModalHandlerResponse
  ): AddColumnModalHandlerResponse {
    const { containerEl, addColumnModalManager } = response;
    const { info, actions } = addColumnModalManager.props.columnState;
    let newColumnName = "";
    const addNewColumnPromise = (): void => {
      const isEmpty = newColumnName.length === 0;
      actions.addToLeft(
        info.getAllColumns().find((o) => o.id === MetadataColumns.ADD_COLUMN),
        isEmpty ? undefined : newColumnName
      );
      new Notice(isEmpty ? "New column added" : `"${newColumnName}" added to the table`, 1500);
      (activeDocument.getElementById(this.textElId) as HTMLInputElement).value = "";
    }

    /**************
     * EMPTY COLUMN
     **************/
    new Setting(containerEl)
      .setName(this.settingTitle)
      .setDesc("Add a new column which do not exist yet in any row")
      .addText(text => {
        text.inputEl.setAttribute("id", this.textElId);
        text.inputEl.onkeydown = (e: KeyboardEvent) => {
          switch (e.key) {
            case "Enter":
              addNewColumnPromise();
              break;
          }
        };
        text.setPlaceholder("Column name")
          .setValue(newColumnName)
          .onChange(async (value: string): Promise<void> => {
            newColumnName = value;
          });
      })
      .addButton((button) => {
        button
          .setIcon("create-new")
          .setTooltip("Add new column")
          .onClick(addNewColumnPromise);
      });
    return this.goNext(response);
  }
}
