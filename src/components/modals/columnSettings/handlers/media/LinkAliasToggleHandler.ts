import { add_toggle } from "settings/SettingsComponents";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
export class LinkAliasToggleHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = 'Enable link alias';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        // pass if modal opened from local settings
        const link_alias_togle_promise = async (value: boolean): Promise<void> => {
            column.config.link_alias_enabled = value;
            // Persist value
            await view.diskConfig.updateColumnConfig(column.key, {
                link_alias_enabled: value
            });
            columnSettingsManager.modal.enableReset = true;
        }

        add_toggle(
            containerEl,
            this.settingTitle,
            "Enable/disable alias for media links using column label",
            column.config.link_alias_enabled,
            link_alias_togle_promise
        );

        return this.goNext(columnHandlerResponse);
    }
}