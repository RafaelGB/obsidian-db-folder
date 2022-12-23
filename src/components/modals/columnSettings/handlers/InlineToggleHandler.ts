import { add_toggle } from "settings/SettingsComponents";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { t } from "lang/helpers";
export class InlineToggleHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
    settingTitle = t("column_settings_modal_inline_toggle_title");
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        const inline_togle_promise = async (value: boolean): Promise<void> => {
            column.config.isInline = value;
            // Persist value
            await view.diskConfig.updateColumnConfig(column.id, {
                isInline: value
            });
            columnSettingsManager.modal.enableReset = true;
            columnSettingsManager.reset(columnHandlerResponse);
        }
        add_toggle(
            containerEl,
            this.settingTitle,
            t("column_settings_modal_inline_toggle_desc"),
            column.config.isInline,
            inline_togle_promise
        );
        return this.goNext(columnHandlerResponse);
    }
}