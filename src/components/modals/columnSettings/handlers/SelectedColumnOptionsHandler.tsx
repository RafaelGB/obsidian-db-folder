import { RowSelectOption } from "cdm/ComponentsModel";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { randomColor, castStringtoHsl, castHslToString } from "helpers/Colors";
import { satinizedColumnOption } from "helpers/FileManagement";
import { t } from "lang/helpers";
import { ButtonComponent, Notice, Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { LOGGER } from "services/Logger";
import { add_setting_header } from "settings/SettingsComponents";

export class SelectedColumnOptionsHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
  settingTitle = t("column_settings_modal_selected_column_options_title");
  handle(
    columnHandlerResponse: ColumnSettingsHandlerResponse
  ): ColumnSettingsHandlerResponse {
    const { column, containerEl, columnSettingsManager } =
      columnHandlerResponse;
    const { view } = columnSettingsManager.modal;
    let newLabel = "";
    const options = column.options;
    const addLabelPromise = async (): Promise<void> => {
      // Error handling
      if (newLabel === "") {
        new Notice(
          t(
            "column_settings_modal_selected_column_options_notice_error_empty_label"
          ),
          1500
        );
        return;
      }
      if (options.find((option) => option.label === newLabel)) {
        new Notice(
          t(
            "column_settings_modal_selected_column_options_notice_error_duplicate_label"
          ),
          1500
        );
        return;
      }
      // Add new label
      const newOption: RowSelectOption = {
        label: newLabel,
        backgroundColor: randomColor(),
      };
      options.push(newOption);
      // Persist changes
      view.diskConfig.updateColumnProperties(column.id, {
        options: options,
      });

      this.addOptionSetting(
        containerEl,
        newOption,
        options,
        options.length - 1,
        columnHandlerResponse
      );
    };
    add_setting_header(containerEl, this.settingTitle, "h3");
    new Setting(containerEl)
      .setName(t("column_settings_modal_selected_column_options_new_option"))
      .setDesc(
        t("column_settings_modal_selected_column_options_new_option_desc")
      )
      .addText((text) => {
        text
          .setPlaceholder(
            t(
              "column_settings_modal_selected_column_options_new_option_placeholder"
            )
          )
          .setValue(newLabel)
          .onChange(async (value: string): Promise<void> => {
            newLabel = satinizedColumnOption(value);
            text.setValue(newLabel);
          });
        text.inputEl.onkeydown = (e: KeyboardEvent) => {
          switch (e.key) {
            case "Enter":
              text.setValue("");
              addLabelPromise();
              break;
          }
        };
      })
      .addButton((button: ButtonComponent) => {
        button
          .setTooltip(
            t(
              "column_settings_modal_selected_column_options_new_option_button_tooltip"
            )
          )
          .setButtonText("+")
          .setCta()
          .onClick(addLabelPromise);
      });

    options.forEach((option, index) => {
      this.addOptionSetting(
        containerEl,
        option,
        options,
        index,
        columnHandlerResponse
      );
    });

    return this.goNext(columnHandlerResponse);
  }

  /**
   * Adds a setting for a single option of a selected column
   * @param containerEl
   * @param option
   * @param options
   * @param index
   * @param columnHandlerResponse
   */
  private addOptionSetting(
    containerEl: HTMLElement,
    option: RowSelectOption,
    options: RowSelectOption[],
    index: number,
    columnHandlerResponse: ColumnSettingsHandlerResponse
  ) {
    const { column } = columnHandlerResponse;
    const { columnSettingsManager } = columnHandlerResponse;
    const { view, dataState, configState, columnsState } =
      columnSettingsManager.modal;
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
          .setTooltip(t("column_settings_modal_selected_column_options_edit"))
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
                  t(
                    "column_settings_modal_selected_column_options_notice_update_success"
                  ),
                  1500
                );
              })
              .catch((err) => {
                const errMsg = t(
                  "column_settings_modal_selected_column_options_notice_update_error",
                  currentLabel
                );
                LOGGER.error(errMsg, err);
                new Notice(errMsg, 3000);
              });
            columnSettingsManager.modal.enableReset = true;
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
            columnSettingsManager.modal.enableReset = true;
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
                  t(
                    "column_settings_modal_selected_column_options_notice_delete_success",
                    removedOption.label
                  ),
                  1500
                );
              })
              .catch((err) => {
                const errMsg = t(
                  "column_settings_modal_selected_column_options_notice_delete_error",
                  removedOption.label
                );
                LOGGER.error(errMsg, err);
                new Notice(errMsg, 3000);
              });
            columnSettingsManager.modal.enableReset = true;
            // Force refresh of settings
            columnSettingsManager.reset(columnHandlerResponse);
          });
      });
  }
}
