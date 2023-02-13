import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { OptionSource } from "helpers/Constants";
import { t } from "lang/helpers";
import { Notice } from "obsidian";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { add_dropdown, add_setting_header } from "settings/SettingsComponents";

export class OptionSourceDropdownHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
  settingTitle = t("column_settings_modal_option_source_dropdown_title");
  handle(
    columnHandlerResponse: ColumnSettingsHandlerResponse
  ): ColumnSettingsHandlerResponse {
    const { column, containerEl, columnSettingsManager } =
      columnHandlerResponse;
    const { view } = columnSettingsManager.modal;
    if (!column.config.option_source) {
      column.config.option_source = OptionSource.MANUAL;
    }

    const options: Record<string, string> = {};
    Object.entries(OptionSource).forEach(([, value]) => {
      options[value] = t(value);
    });

    const optionSourcePromise = async (optionSource: string): Promise<void> => {
      if (optionSource === column.config.option_source) {
        new Notice("No changes made", 1500);
        return;
      }

      // Persist changes
      await view.diskConfig.updateColumnConfig(column.id, {
        option_source: optionSource,
      });

      // Reset options
      await view.diskConfig.updateColumnProperties(column.id, {
        options: [],
      });

      columnHandlerResponse.column.config.option_source = optionSource;
      // Reset column settings
      columnSettingsManager.reset(columnHandlerResponse);
    };

    add_setting_header(containerEl, t("column_settings_modal_selected_column_options_title"), "h4");
    add_dropdown(
      containerEl,
      t("column_settings_modal_option_source_dropdown_title"),
      t("column_settings_modal_option_source_dropdown_desc"),
      column.config.option_source,
      options,
      optionSourcePromise
    );

    return this.goNext(columnHandlerResponse);
  }
}
