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
    const onClickAddPromise = async (): Promise<void> => {
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
      })
      .addButton((button: ButtonComponent) => {
        button
          .setTooltip("Adds new option of Selected column")
          .setButtonText("+")
          .setCta()
          .onClick(onClickAddPromise);
      });

    options.forEach((option, index) => {
      new Setting(containerEl)
        // Show current label
        .addText((text) => {
          text.setValue(option.label).setDisabled(true);
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
