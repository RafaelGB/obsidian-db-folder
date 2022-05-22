import { ColumnHandlerResponse } from "cdm/ModalSettingsModel";
import { ColorPickerProps } from "cdm/StyleModel";
import { ColorPicker } from "components/ColorPicker";
import { AbstractColumnHandler } from "components/modals/handlers/AbstractColumnHandler";
import { castHslToString } from "components/styles/ColumnWidthStyle";
import { randomColor } from "helpers/Colors";
import { ButtonComponent, Setting } from "obsidian";
import React from "react";
import { ColorResult } from "react-color";
import ReactDOM from "react-dom";
import { add_button } from "settings/SettingsComponents";

export class SelectedColumnOptionsHandler extends AbstractColumnHandler {
  settingTitle: string = "Column Options";
  handle(columnHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
    const { column, containerEl, view, columnSettingsManager } =
      columnHandlerResponse;

    let newLabel = "";
    const options = column.options;
    const onClickAddPromise = async (): Promise<void> => {
      options.push({
        label: newLabel,
        backgroundColor: randomColor(),
      });
      // Persist changes
      view.diskConfig.updateColumnConfig(column.key, {
        options: options,
      });
      // Force refresh of settings
      columnSettingsManager.reset(columnHandlerResponse);
    };

    new Setting(containerEl)
      .setName("Add new label")
      .setDesc(
        "Adds a new filter to the dataview query when the database is initialized"
      )
      .addText((text) => {
        text
          .setPlaceholder("label of option")
          .setValue("")
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
            await view.diskConfig.updateColumnConfig(column.key, {
              options: options,
            });
            // Force refresh of settings
            columnSettingsManager.reset(columnHandlerResponse);
          });
      });

      ReactDOM.render(
        <ColorPicker {...colorPickerProps} />,
        optionContainer.settingEl.createDiv()
      );
    });

    return this.goNext(columnHandlerResponse);
  }
}
