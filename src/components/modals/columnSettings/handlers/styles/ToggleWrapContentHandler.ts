import { add_toggle } from "settings/SettingsComponents";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
export class ToggleWrapContentHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
  settingTitle: string = "Wrap content";
  handle(
    columnHandlerResponse: ColumnSettingsHandlerResponse
  ): ColumnSettingsHandlerResponse {
    const { column, containerEl, columnSettingsManager } =
      columnHandlerResponse;
    const { view } = columnSettingsManager.modal;
    const wrap_content_togle_promise = async (value: boolean): Promise<void> => {
      // Persist value
      await view.diskConfig.updateColumnConfig(column.key, {
        wrap_content: value,
      });
      columnSettingsManager.modal.enableReset = true;
    };
    add_toggle(
      containerEl,
      this.settingTitle,
      "Wrap content of the cells in the column",
      column.config.wrap_content,
      wrap_content_togle_promise
    );
    return this.goNext(columnHandlerResponse);
  }
}
