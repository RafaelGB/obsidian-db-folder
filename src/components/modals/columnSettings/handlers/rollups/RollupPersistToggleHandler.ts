import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
import { add_toggle } from "settings/SettingsComponents";

export class RollupPersistToggleHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse>  {
    settingTitle: string = 'Persist rollup output';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        const { config } = column;
        const persist_rollup_toggle_promise = async (value: boolean): Promise<void> => {
            // Persist value
            await view.diskConfig.updateColumnConfig(column.id, {
                persist_rollup: value
            });
            columnSettingsManager.modal.enableReset = true;
        }
        add_toggle(
            containerEl,
            this.settingTitle,
            "Enable/disable to persist rollup output on your notes (Only persisted rollups could be searchable and sortable)",
            config.persist_rollup,
            persist_rollup_toggle_promise
        );
        return this.goNext(columnHandlerResponse);
    }
}