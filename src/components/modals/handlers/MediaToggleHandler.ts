import { add_toggle } from "settings/SettingsComponents";
import { AbstractColumnHandler } from "components/modals/handlers/AbstractColumnHandler";
import { ColumnHandlerResponse } from "cdm/ModalSettingsModel";
export class MediaToggleHandler extends AbstractColumnHandler {
    settingTitle: string = 'Enable media links';
    handle(columnHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
        const { column, containerEl, view, columnSettingsManager } = columnHandlerResponse;
        // pass if modal opened from local settings
        const media_togle_promise = async (value: boolean): Promise<void> => {
            column.config.enable_media_view = value;
            // Check context to define correct promise
            // Persist value
            await view.diskConfig.updateColumnConfig(column.key, {
                media_togle_promise: value
            });
            // Force refresh of settings
            columnSettingsManager.reset(columnHandlerResponse);
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