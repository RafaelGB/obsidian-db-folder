import { add_toggle } from "settings/SettingsComponents";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/AbstractHandler";
export class InlineToggleHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
    settingTitle: string = 'Inline field';
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        const inline_togle_promise = async (value: boolean): Promise<void> => {
            column.config.isInline = value;
            // Persist value
            await view.diskConfig.updateColumnConfig(column.key, {
                isInline: value
            });
            columnSettingsManager.modal.enableReset = true;
        }
        add_toggle(
            containerEl,
            this.settingTitle,
            "Convert field to inline (field:: value) or leave it as frontmatter (---field: value---)",
            column.config.isInline,
            inline_togle_promise
        );
        return this.goNext(columnHandlerResponse);
    }
}