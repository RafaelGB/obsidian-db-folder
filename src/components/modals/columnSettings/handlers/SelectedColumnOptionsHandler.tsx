import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { ColorPickerProps } from "cdm/StyleModel";
import { ColorPicker } from "components/ColorPicker";
import { randomColor } from "helpers/Colors";
import { ButtonComponent, Notice, Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import React from "react";
import { createRoot } from "react-dom/client";

export class SelectedColumnOptionsHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
  settingTitle: string = "Column Options";
  handle(
    columnHandlerResponse: ColumnSettingsHandlerResponse
  ): ColumnSettingsHandlerResponse {
    const { column, containerEl, columnSettingsManager } =
      columnHandlerResponse;
    const { view } = columnSettingsManager.modal;
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
      view.diskConfig.updateColumnProperties(column.key, {
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
      const colorPickerProps: ColorPickerProps = {
        view: view,
        options: options,
        option: option,
        columnKey: column.key,
      };

      const optionContainer = new Setting(containerEl).addExtraButton((cb) => {
        cb.setIcon("cross")
          .setTooltip("Delete")
          .onClick(async (): Promise<void> => {
            options.splice(index, 1);
            // Persist changes
            await view.diskConfig.updateColumnProperties(column.key, {
              options: options,
            });
            // Force refresh of settings
            columnSettingsManager.reset(columnHandlerResponse);
          });
      });
      createRoot(optionContainer.settingEl.createDiv()).render(
        <ColorPicker {...colorPickerProps} />
      );
    });

    return this.goNext(columnHandlerResponse);
  }
}
