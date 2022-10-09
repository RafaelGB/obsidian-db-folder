import { add_toggle } from "settings/SettingsComponents";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
export class NestedToggleHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
    settingTitle: string = 'Nested field';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        if (!column.config.isInline) {
            const is_nested_togle_promise = async (value: boolean): Promise<void> => {
                column.config.isNested = value;
                // Persist value
                await view.diskConfig.updateColumnConfig(column.key, {
                    isNested: value
                });
                columnSettingsManager.modal.enableReset = true;
                columnSettingsManager.reset(columnHandlerResponse);
            }
            add_toggle(
                containerEl,
                this.settingTitle,
                "Convert field to nested yaml field (level1.level2.field: value) or leave it as root field (field: value)",
                column.config.isNested,
                is_nested_togle_promise
            );
        }
        return this.goNext(columnHandlerResponse);
    }
}