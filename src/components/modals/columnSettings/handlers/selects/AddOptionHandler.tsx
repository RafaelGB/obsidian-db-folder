import { ColumnOption } from "cdm/ComponentsModel";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { OptionSource } from "helpers/Constants";
import { satinizedColumnOption } from "helpers/FileManagement";
import { c } from "helpers/StylesHelper";
import { t } from "lang/helpers";
import { ButtonComponent, Notice, Setting } from "obsidian";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { Db } from "services/CoreService";

export class AddOptionHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
  settingTitle = t("column_settings_modal_selected_column_options_new_option");
  handle(
    columnHandlerResponse: ColumnSettingsHandlerResponse
  ): ColumnSettingsHandlerResponse {
    const { column, containerEl, columnSettingsManager } =
      columnHandlerResponse;
    const { view } = columnSettingsManager.modal;
    if (column.config.option_source === OptionSource.MANUAL) {
      let newLabel = "";
      let newValue = "";
      const options = column.options;
      const addLabelPromise = async (): Promise<void> => {
        // Error handling
        if (newLabel === "" || newValue === "") {
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
        const newOption: ColumnOption = {
          label: newLabel,
          value: newValue,
          color: Db.coreFns.colors.randomColor(),
        };
        options.push(newOption);
        // Persist changes
        view.diskConfig.updateColumnProperties(column.id, {
          options: options,
        });
      };
      new Setting(containerEl)
        .setName(this.settingTitle)
        .setDesc(
          t("column_settings_modal_selected_column_options_new_option_desc")
        )
        .setClass(c("setting-item"))
        .addText((text) => {
          text
            .setPlaceholder(
              t(
                "column_settings_modal_selected_column_options_new_option_label_placeholder"
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
        .addText((text) => {
          text
            .setPlaceholder(
              t(
                "column_settings_modal_selected_column_options_new_option_value_placeholder"
              )
            )
            .setValue(newValue)
            .onChange(async (value: string): Promise<void> => {
              newValue = satinizedColumnOption(value);
              text.setValue(newValue);
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
    }
    return this.goNext(columnHandlerResponse);
  }
}
