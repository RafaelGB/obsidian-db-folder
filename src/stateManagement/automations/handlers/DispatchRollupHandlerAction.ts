import Rollup from "automations/Rollup";
import { ConfigColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { Link } from "obsidian-dataview";
import { LOGGER } from "services/Logger";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class DispatchRollupHandlerAction extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { implementation } = tableActionResponse;
        implementation.info.dispatchRollup = (configColumn: ConfigColumn, relation: Link[], ddbbConfig: LocalSettings) => {
            try {
                return new Rollup(relation, configColumn.rollup_action, configColumn.rollup_key).dispatch();
            } catch (e) {
                LOGGER.error(`Error dispatching rollup of ${configColumn.asociated_relation_id} relation: `, e);
                return "";
            }
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}