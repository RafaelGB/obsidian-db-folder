import { add_toggle } from "settings/SettingsComponents";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
export class HideCompletedTaskToggleHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
    settingTitle: string = 'Hide completed tasks';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        const inline_togle_promise = async (value: boolean): Promise<void> => {
            column.config.task_hide_completed = value;
            // Persist value
            await view.diskConfig.updateColumnConfig(column.id, {
                task_hide_completed: value
            });
            columnSettingsManager.modal.enableReset = true;
        }
        add_toggle(
            containerEl,
            this.settingTitle,
            "Hide the completed tasks shown in the task column",
            column.config.task_hide_completed,
            inline_togle_promise
        );
        return this.goNext(columnHandlerResponse);
    }
}