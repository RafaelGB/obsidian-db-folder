import { AddColumnModalHandlerResponse } from "cdm/ModalsModel";
import { ColumnSettingsModal } from "components/modals/columnSettings/ColumnSettingsModal";
import { ConfirmModal } from "components/modals/ConfirmModal";
import { DynamicInputType } from "helpers/Constants";
import { t } from "lang/helpers";
import { Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { StringSuggest } from "settings/suggesters/StringSuggester";

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
    const typesRecord: Record<string, string> = {};
    Object.values(DynamicInputType).forEach((value) => {
      typesRecord[value] = t(value);
    });
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

        const selectTypeHandler = (value: string): void => {
          if (column.input === value || !value) return;
          columnState.actions.alterColumnType(column, value);
          addColumnModalManager.addColumnModal.enableReset = true;
        }
        // Cross column settings
        const columnSetting = new Setting(containerEl)
          .setName(column.label)
          .setDesc(`Quick options of ${column.label}${column.isMetadata ? " (metadata)" : ""}`)
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
          });
        // Add extra options for non-metadata columns
        if (!column.isMetadata) {
          // Select type
          columnSetting
            .addSearch(cb => {
              new StringSuggest(
                cb.inputEl,
                typesRecord
              );
              cb.setPlaceholder("Select type...")
                .setValue(column.input)
                .onChange(selectTypeHandler);
            });
          // Delete column
          columnSetting
            .addButton(button => {
              button
                .setIcon("trash")
                .setTooltip(`Delete ${column.label}`)
                .onClick(async () => {
                  const confirmation = await new ConfirmModal()
                    .setMessage(`Are you sure you want to delete ${column.label}?`)
                    .isConfirmed();
                  if (confirmation) {
                    columnState.actions.remove(column);
                    // Refresh the modal to remove the selected column from the dropdown
                    addColumnModalManager.reset(response);
                  }
                })
            });
        }
      });
    return this.goNext(response);
  }
}
