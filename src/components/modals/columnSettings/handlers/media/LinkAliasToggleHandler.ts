import { add_text, add_toggle } from "settings/SettingsComponents";
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
            await view.diskConfig.updateColumnConfig(column.id, {
                link_alias_enabled: value
            });
            columnSettingsManager.modal.enableReset = true;
            columnSettingsManager.reset(columnHandlerResponse);
        }

        const custom_link_alias_promise = async (value: string): Promise<void> => {
            column.config.custom_link_alias = value;
            // Persist value
            await view.diskConfig.updateColumnConfig(column.id, {
                custom_link_alias: value
            });
            columnSettingsManager.modal.enableReset = true;
        };

        add_toggle(
            containerEl,
            this.settingTitle,
            "Enable/disable alias for media links using column label",
            column.config.link_alias_enabled,
            link_alias_togle_promise
        );
        if (column.config.link_alias_enabled) {
            add_text(
                containerEl,
                'Custom link alias',
                'Custom alias for media links (leave blank to use column label)',
                'insert alias...',
                column.config.custom_link_alias,
                custom_link_alias_promise,
            )
        }

        return this.goNext(columnHandlerResponse);
    }
}