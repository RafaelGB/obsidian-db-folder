import { add_toggle } from "settings/SettingsComponents";
import { ColumnSettingsHandlerResponse } from "cdm/ModalsModel";
import { AbstractHandlerClass } from "patterns/chain/AbstractHandler";
import DatabaseInfo from "services/DatabaseInfo";
import { resolve_tfile } from "helpers/FileManagement";

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
                await this.createBidirectionalRelation(columnHandlerResponse, value);

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

    /**
     * Manages the bidirectional relation
     * @param columnHandlerResponse 
     */
    async createBidirectionalRelation(columnHandlerResponse: ColumnSettingsHandlerResponse, toggleValue: boolean): Promise<void> {
        const { column, columnSettingsManager } = columnHandlerResponse;
        const { view } = columnSettingsManager.modal;
        const file = resolve_tfile(column.config.related_note_path);
        const relatedDB = await new DatabaseInfo(file, view.plugin.settings.local_settings).build();
        // Check if the relation is already bidirectional
        if (toggleValue) {
            const relatedColumn = { ...view.diskConfig.yaml.columns[column.id] };
            relatedColumn.config.related_note_path = view.file.path;
            relatedDB.yaml.columns[column.id] = relatedColumn;
        } else {
            delete relatedDB.yaml.columns[column.id];
        }
        await relatedDB.saveOnDisk();
    }
}
