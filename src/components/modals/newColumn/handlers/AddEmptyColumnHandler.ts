import { AddColumnModalHandlerResponse } from "cdm/ModalsModel";
import { MetadataColumns } from "helpers/Constants";
import { Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/AbstractHandler";

export class AddEmptyColumnHandler extends AbstractHandlerClass<AddColumnModalHandlerResponse> {
  settingTitle: string = "Add empty column";
  handle(
    response: AddColumnModalHandlerResponse
  ): AddColumnModalHandlerResponse {
    const { containerEl, addColumnModalManager } = response;
    const { columns, addToLeft } = addColumnModalManager.props.columnsState;

    /**************
     * EMPTY COLUMN
     **************/
    new Setting(containerEl)
      .setName(this.settingTitle)
      .setDesc("Add a new column which do not exist yet in any row")
      .addButton((button) => {
        button
          .setIcon("create-new")
          .setTooltip("Add new column")
          .onClick(async (): Promise<void> => {
            addToLeft(columns.find((o) => o.id === MetadataColumns.ADD_COLUMN));
            addColumnModalManager.addColumnModal.close();
          });
      });
    return this.goNext(response);
  }
}
