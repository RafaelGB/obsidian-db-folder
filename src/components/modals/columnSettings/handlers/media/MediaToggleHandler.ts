import { add_toggle } from "settings/SettingsComponents";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { t } from "lang/helpers";
export class MediaToggleHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = t("column_settings_modal_media_toggle_title");
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        // pass if modal opened from local settings
        const media_togle_promise = async (value: boolean): Promise<void> => {
            column.config.enable_media_view = value;
            // Check context to define correct promise
            // Persist value
            await view.diskConfig.updateColumnConfig(column.id, {
                enable_media_view: value,
                link_alias_enabled: value ? column.config.link_alias_enabled : false
            });
            // Force refresh of settings
            columnSettingsManager.reset(columnHandlerResponse);
            columnSettingsManager.modal.enableReset = true;
        }

        add_toggle(
            containerEl,
            this.settingTitle,
            t("column_settings_modal_media_toggle_desc"),
            column.config.enable_media_view,
            media_togle_promise
        );

        return this.goNext(columnHandlerResponse);
    }
}