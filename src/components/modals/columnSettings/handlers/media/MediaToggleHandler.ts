import { add_toggle } from "settings/SettingsComponents";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
export class MediaToggleHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = 'Enable media links';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        // pass if modal opened from local settings
        const media_togle_promise = async (value: boolean): Promise<void> => {
            column.config.enable_media_view = value;
            // Check context to define correct promise
            // Persist value
            await view.diskConfig.updateColumnConfig(column.key, {
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
            "Enable/disable wrap media links with embedding content",
            column.config.enable_media_view,
            media_togle_promise
        );

        return this.goNext(columnHandlerResponse);
    }
}