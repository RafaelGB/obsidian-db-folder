import { AddColumnModalHandlerResponse } from "cdm/ModalsModel";
import { Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/AbstractHandler";

export class HideColumnsHandler extends AbstractHandlerClass<AddColumnModalHandlerResponse> {
  settingTitle: string = "Shown/Hide columns";
  handle(
    response: AddColumnModalHandlerResponse
  ): AddColumnModalHandlerResponse {
    const { containerEl, addColumnModalManager } = response;
    const { info, actions } = addColumnModalManager.props.columnsState;

    /******************
     * SHOW COLUMN MENU
     ******************/
    // List of columns to show/hide
    info.getAllColumns()
      .filter(c => !c.skipPersist)
      .forEach((column) => {
        const toggleHandler = (shown: boolean): void => {
          actions.alterIsHidden(column, !shown);
          addColumnModalManager.addColumnModal.enableReset = true;
        }

        new Setting(containerEl)
          .setName(column.label)
          .setDesc(`Show or hide ${column.label}`)
          .addToggle(toggle =>
            toggle
              .setValue(!column.isHidden)
              .onChange(toggleHandler)
          );
      });
    return this.goNext(response);
  }
}
