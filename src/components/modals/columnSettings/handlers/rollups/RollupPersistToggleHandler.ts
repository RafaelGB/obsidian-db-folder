import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { t } from "lang/helpers";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import { add_toggle } from "settings/SettingsComponents";

export class RollupPersistToggleHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = t("column_settings_modal_rollup_persist_toggle_title");
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        const { config } = column;
        const persist_changes_toggle_promise = async (value: boolean): Promise<void> => {
            // Persist value
            await view.diskConfig.updateColumnConfig(column.id, {
                persist_changes: value
            });
            columnSettingsManager.modal.enableReset = true;
        }
        add_toggle(
            containerEl,
            this.settingTitle,
            t("column_settings_modal_rollup_persist_toggle_desc"),
            config.persist_changes,
            persist_changes_toggle_promise
        );
        return this.goNext(columnHandlerResponse);
    }
}