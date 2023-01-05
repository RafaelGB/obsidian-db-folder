import { add_toggle } from "settings/SettingsComponents";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { t } from "lang/helpers";
export class ToggleWrapContentHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
  settingTitle = t("column_settings_modal_wrap_content_toggle_title");
  handle(
    columnHandlerResponse: ColumnSettingsHandlerResponse
  ): ColumnSettingsHandlerResponse {
    const { column, containerEl, columnSettingsManager } =
      columnHandlerResponse;
    const { view } = columnSettingsManager.modal;
    const wrap_content_togle_promise = async (value: boolean): Promise<void> => {
      // Persist value
      await view.diskConfig.updateColumnConfig(column.id, {
        wrap_content: value,
      });
      columnSettingsManager.modal.enableReset = true;
    };
    add_toggle(
      containerEl,
      this.settingTitle,
      t("column_settings_modal_wrap_content_toggle_desc"),
      column.config.wrap_content,
      wrap_content_togle_promise
    );
    return this.goNext(columnHandlerResponse);
  }
}
