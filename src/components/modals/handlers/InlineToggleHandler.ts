import { add_toggle } from "settings/SettingsComponents";
import { AbstractColumnHandler } from "components/modals/handlers/AbstractColumnHandler";
import { ColumnHandlerResponse } from "cdm/ModalSettingsModel";
export class InlineToggleHandler extends AbstractColumnHandler {
    settingTitle: string = 'Inline field';
    handle(columnHandlerResponse: ColumnHandlerResponse): ColumnHandlerResponse {
        const { column, containerEl, view } = columnHandlerResponse;
        const inline_togle_promise = async (value: boolean): Promise<void> => {
            column.config.isInline = value;
            // Persist value
            await view.diskConfig.updateColumnConfig(column.key, {
                isInline: value
            });
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