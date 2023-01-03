import { AddColumnModalHandlerResponse } from "cdm/ModalsModel";
import { DynamicInputType, MetadataColumns } from "helpers/Constants";
import { t } from "lang/helpers";
import { Notice, Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";

export class AddEmptyColumnHandler extends AbstractHandlerClass<AddColumnModalHandlerResponse> {
  settingTitle = t("add_row_modal_add_empty_column_title");
  textElId = "SettingsModalManager-addEmptyColumn-input";
  handle(
    response: AddColumnModalHandlerResponse
  ): AddColumnModalHandlerResponse {
    const { containerEl, addColumnModalManager } = response;
    const { columnState } = addColumnModalManager.props;
    let newColumnName = "";
    let typeOfNewColumn = "";
    const typesRecord: Record<string, string> = {};
    Object.values(DynamicInputType).forEach((value) => {
      typesRecord[value] = t(value);
    });
    const addNewColumnPromise = (): void => {
      const isEmpty = newColumnName.length === 0;
      columnState.actions.addToLeft(
        columnState.info.getAllColumns().find((o) => o.id === MetadataColumns.ADD_COLUMN),
        isEmpty ? undefined : newColumnName,
        typeOfNewColumn ? typeOfNewColumn : DynamicInputType.TEXT
      );
      new Notice(
        isEmpty ?
          t("add_row_modal_add_empty_notice_empty") :
          t("add_row_modal_add_empty_notice_informed", newColumnName),
        1500);
      (activeDocument.getElementById(this.textElId) as HTMLInputElement).value = "";
    }

    const selectTypeHandler = (value: string): void => {
      typeOfNewColumn = value;
    }

    /**************
     * EMPTY COLUMN
     **************/
    new Setting(containerEl)
      .setName(this.settingTitle)
      .setDesc(t("add_row_modal_add_empty_column_desc"))
      .addText(text => {
        text.inputEl.setAttribute("id", this.textElId);
        text.inputEl.onkeydown = (e: KeyboardEvent) => {
          switch (e.key) {
            case "Enter":
              addNewColumnPromise();
              break;
          }
        };
        text.setPlaceholder(t("add_row_modal_add_empty_column_placeholder"))
          .setValue(newColumnName)
          .onChange(async (value: string): Promise<void> => {
            newColumnName = value;
          });
      })
      .addDropdown((dropdown) => {
        dropdown.addOptions(typesRecord);
        dropdown.setValue(DynamicInputType.TEXT);
        dropdown.onChange(selectTypeHandler);
      })
      .addExtraButton((button) => {
        button
          .setIcon("create-new")
          .setTooltip(t("add_row_modal_add_empty_column_button_tooltip"))
          .onClick(addNewColumnPromise);
      });
    return this.goNext(response);
  }
}