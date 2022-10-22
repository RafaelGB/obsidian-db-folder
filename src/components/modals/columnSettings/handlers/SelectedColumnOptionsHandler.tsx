import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { randomColor, castStringtoHsl, castHslToString } from "helpers/Colors";
import { ButtonComponent, Notice, Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { LOGGER } from "services/Logger";

export class SelectedColumnOptionsHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
  settingTitle: string = "Column Options";
  handle(
    columnHandlerResponse: ColumnSettingsHandlerResponse
  ): ColumnSettingsHandlerResponse {
    const { column, containerEl, columnSettingsManager } =
      columnHandlerResponse;
    const { view, dataState, configState, columnsState } =
      columnSettingsManager.modal;
    let newLabel = "";
    const options = column.options;
    const addLabelPromise = async (): Promise<void> => {
      // Error handling
      if (newLabel === "") {
        new Notice("Empty label could not be added!");
        return;
      }
      if (options.find((option) => option.label === newLabel)) {
        new Notice("Duplicate labels could not be added!");
        return;
      }
      // Add new label
      options.push({
        label: newLabel,
        backgroundColor: randomColor(),
      });
      // Persist changes
      view.diskConfig.updateColumnProperties(column.id, {
        options: options,
      });
      // Force refresh of settings
      columnSettingsManager.reset(columnHandlerResponse);
      columnSettingsManager.modal.enableReset = true;
    };

    new Setting(containerEl)
      .setName("Add new label")
      .setDesc("Add new label to the list of options available for this column")
      .addText((text) => {
        text
          .setPlaceholder("label of option")
          .setValue(newLabel)
          .onChange(async (value: string): Promise<void> => {
            newLabel = value;
          });
        text.inputEl.onkeydown = (e: KeyboardEvent) => {
          switch (e.key) {
            case "Enter":
              addLabelPromise();
              break;
          }
        };
      })
      .addButton((button: ButtonComponent) => {
        button
          .setTooltip("Adds new option of Selected column")
          .setButtonText("+")
          .setCta()
          .onClick(addLabelPromise);
      });

    options.forEach((option, index) => {
      let currentLabel = option.label;
      new Setting(containerEl)
        // Show current label
        .addText((text) => {
          text
            .setValue(currentLabel)
            .onChange(async (value: string): Promise<void> => {
              currentLabel = value;
            });
        })
        // Edit label button
        .addExtraButton((cb) => {
          cb.setIcon("pencil")
            .setTooltip("Save new label")
            .onClick(async (): Promise<void> => {
              const oldLabel = option.label;
              if (currentLabel === oldLabel) {
                new Notice(
                  `Option label "${currentLabel}" was not changed!`,
                  1500
                );
                return;
              }
              // Persist on disk
              options[index].label = currentLabel;
              await view.diskConfig.updateColumnProperties(column.id, {
                options: options,
              });
              // Update in memory
              dataState.actions
                .editOptionForAllRows(
                  column,
                  oldLabel,
                  currentLabel,
                  columnsState.info.getAllColumns(),
                  configState.info.getLocalSettings()
                )
                .then(() => {
                  new Notice(
                    `Option was updated for all rows. Please refresh the view to see the changes.`,
                    1500
                  );
                })
                .catch((err) => {
                  const errMsg = `Error editing ${currentLabel}`;
                  LOGGER.error(errMsg, err);
                  new Notice(errMsg, 3000);
                });
              columnHandlerResponse.columnSettingsManager.modal.enableReset =
                true;
            });
        })
        // Color picker for background color
        .addColorPicker((colorPicker) => {
          colorPicker
            .setValueHsl(castStringtoHsl(option.backgroundColor))
            .onChange(async () => {
              options[index].backgroundColor = castHslToString(
                colorPicker.getValueHsl()
              );
              await view.diskConfig.updateColumnProperties(column.id, {
                options: options,
              });
              columnHandlerResponse.columnSettingsManager.modal.enableReset =
                true;
            });
        })
        // Delete button
        .addExtraButton((cb) => {
          cb.setIcon("cross")
            .setTooltip("Delete")
            .onClick(async (): Promise<void> => {
              const removedOption = options[index];
              options.splice(index, 1);
              // Persist changes
              await view.diskConfig.updateColumnProperties(column.id, {
                options: options,
              });

              dataState.actions
                .removeOptionForAllRows(
                  column,
                  removedOption.label,
                  columnsState.info.getAllColumns(),
                  configState.info.getLocalSettings()
                )
                .then(() => {
                  new Notice(
                    `Option ${removedOption.label} was removed from all rows`,
                    1500
                  );
                })
                .catch((err) => {
                  const errMsg = `Error removing ${removedOption.label}`;
                  LOGGER.error(errMsg, err);
                  new Notice(errMsg, 3000);
                });
              columnHandlerResponse.columnSettingsManager.modal.enableReset =
                true;
              // Force refresh of settings
              columnSettingsManager.reset(columnHandlerResponse);
            });
        });
    });

    return this.goNext(columnHandlerResponse);
  }
}
