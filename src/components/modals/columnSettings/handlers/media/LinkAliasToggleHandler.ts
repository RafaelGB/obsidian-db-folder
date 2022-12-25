import { add_text, add_toggle } from "settings/SettingsComponents";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { t } from "lang/helpers";
export class LinkAliasToggleHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = t("column_settings_modal_link_alias_title");
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
            t("column_settings_modal_link_alias_desc"),
            column.config.link_alias_enabled,
            link_alias_togle_promise
        );
        if (column.config.link_alias_enabled) {
            add_text(
                containerEl,
                t("column_settings_modal_link_alias_text_title"),
                t("column_settings_modal_link_alias_text_desc"),
                t("column_settings_modal_link_alias_text_placeholder"),
                column.config.custom_link_alias,
                custom_link_alias_promise,
            )
        }

        return this.goNext(columnHandlerResponse);
    }
}