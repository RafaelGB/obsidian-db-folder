import { AddColumnModalHandlerResponse } from "cdm/ModalsModel";
import { ColumnSettingsModal } from "components/modals/columnSettings/ColumnSettingsModal";
import { Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/AbstractHandler";

export class QuickOptionsColumnsHandler extends AbstractHandlerClass<AddColumnModalHandlerResponse> {
  settingTitle: string = "Shown/Hide columns";
  handle(
    response: AddColumnModalHandlerResponse
  ): AddColumnModalHandlerResponse {
    const { containerEl, addColumnModalManager } = response;
    const { columnState, dataState, view, configState } = addColumnModalManager.props;
    const { addColumnModal } = addColumnModalManager;
    /******************
     * SHOW COLUMN MENU
     ******************/
    // List of columns to show/hide
    columnState.info.getAllColumns()
      .filter(c => !c.skipPersist)
      .forEach((column) => {
        const toggleHandler = (shown: boolean): void => {
          columnState.actions.alterIsHidden(column, !shown);
          addColumnModalManager.addColumnModal.enableReset = true;
        }

        const openSettingsHandler = async (): Promise<void> => {
          addColumnModal.close();
          new ColumnSettingsModal({
            dataState: dataState,
            columnState: columnState,
            configState: configState,
            view: view,
            tableColumn: column,
          }).open();
        }

        new Setting(containerEl)
          .setName(column.label)
          .setDesc(`Quick options of ${column.label}`)
          .addToggle(toggle =>
            toggle
              .setValue(!column.isHidden)
              .onChange(toggleHandler)
              .setTooltip(`Show or hide ${column.label}`)
          )
          .addButton(button => {
            button
              .setIcon("gear")
              .setTooltip(`Open settings of ${column.label}`)
              .onClick(openSettingsHandler)
          }
          )
          .addButton(button => {
            button
              .setIcon("trash")
              .setTooltip(`Delete ${column.label}`)
              .onClick(() => {
                columnState.actions.remove(column);
                // Refresh the modal to remove the selected column from the dropdown
                addColumnModalManager.reset(response);
              })
          }
          )
      });
    return this.goNext(response);
  }
}
