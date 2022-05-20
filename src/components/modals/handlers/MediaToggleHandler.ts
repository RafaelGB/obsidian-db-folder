import { add_toggle } from "settings/SettingsComponents";
import { AbstractColumnHandler, ColumnHandlerResponse } from "components/modals/handlers/AbstractColumnHandler";
export class MediaToggleHandler extends AbstractColumnHandler {
    settingTitle: string = 'Enable media links';
    handle(settingHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
        const { column, containerEl, view } = settingHandlerResponse;
        // pass if modal opened from local settings
        const media_togle_promise = async (value: boolean): Promise<void> => {
            column.config.enable_media_view = value;
            // Check context to define correct promise
            // Persist value
            view.diskConfig.updateColumnConfig(column.key, {
                media_togle_promise: value
            });
            // Force refresh of settings
            //settingsManager.reset(settingHandlerResponse);
        }
        add_toggle(
            containerEl,
            this.settingTitle,
            "Enable/disable wrap media links with embedding content",
            column.config.enable_media_view,
            media_togle_promise
        );
        return this.goNext(settingHandlerResponse);
    }
}