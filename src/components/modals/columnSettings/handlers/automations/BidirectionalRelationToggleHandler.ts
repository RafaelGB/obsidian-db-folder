import { add_toggle } from "settings/SettingsComponents";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";

export class BidirectionalRelationToggleHandler extends AbstractHandlerClass<ColumnSettingsHandlerResponse> {
    settingTitle = "Bidirectional Relation";
    handle(columnHandlerResponse: ColumnSettingsHandlerResponse): ColumnSettingsHandlerResponse {
        const { column, containerEl, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        // Check if column has a configured relation
        if (column.config.related_note_path) {
            const bidirectional_relation_togle_promise = async (value: boolean): Promise<void> => {
                // Persist value
                await view.diskConfig.updateColumnConfig(column.id, {
                    bidirectional_relation: value
                });
                columnSettingsManager.modal.enableReset = true;
            }

            add_toggle(
                containerEl,
                this.settingTitle,
                "If enabled, the relation will be bidirectional. If disabled, the relation will be unidirectional.",
                column.config.bidirectional_relation,
                bidirectional_relation_togle_promise
            );
        }
        return this.goNext(columnHandlerResponse);
    }
}
