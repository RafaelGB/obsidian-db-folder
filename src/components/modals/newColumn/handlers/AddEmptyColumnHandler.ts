import { AddColumnModalHandlerResponse } from "cdm/ModalsModel";
import { DynamicInputType, MetadataColumns } from "helpers/Constants";
import { Notice, Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { StringSuggest } from "settings/suggesters/StringSuggester";

export class AddEmptyColumnHandler extends AbstractHandlerClass<AddColumnModalHandlerResponse> {
  settingTitle: string = "Add empty column";
  textElId: string = "SettingsModalManager-addEmptyColumn-input";
  handle(
    response: AddColumnModalHandlerResponse
  ): AddColumnModalHandlerResponse {
    const { containerEl, addColumnModalManager } = response;
    const { columnState } = addColumnModalManager.props;
    let newColumnName = "";
    let typeOfNewColumn: string = DynamicInputType.TEXT;
    const typesRecord: Record<string, string> = {};
    Object.values(DynamicInputType).forEach((value) => {
      typesRecord[value] = value;
    });
    const addNewColumnPromise = (): void => {
      const isEmpty = newColumnName.length === 0;
      columnState.actions.addToLeft(
        columnState.info.getAllColumns().find((o) => o.id === MetadataColumns.ADD_COLUMN),
        isEmpty ? undefined : newColumnName,
        typeOfNewColumn
      );
      new Notice(isEmpty ? "New column added" : `"${newColumnName}" added to the table`, 1500);
      (activeDocument.getElementById(this.textElId) as HTMLInputElement).value = "";
    }

    const selectTypeHandler = (value: string): void => {
      if (!value) return;
      typeOfNewColumn = value;
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
      .addSearch(cb => {
        new StringSuggest(
          cb.inputEl,
          typesRecord
        );
        cb.setPlaceholder("Select type...")
          .setValue(DynamicInputType.TEXT)
          .onChange(selectTypeHandler);
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
