import Rollup from "automations/Rollup";
import { ConfigColumn } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { Link, Literal } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { LOGGER } from "services/Logger";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class DispatchRollupHandlerAction extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { implementation } = tableActionResponse;
        implementation.info.dispatchRollup = (configColumn: ConfigColumn, relation: Literal, ddbbConfig: LocalSettings) => {
            let validatedRelation: Link[] = [];
            try {
                const wrappedRelation = DataviewService.wrapLiteral(relation);

                if (wrappedRelation.type === "link") {
                    validatedRelation.push(wrappedRelation.value);
                } else if (wrappedRelation.type === "array") {
                    validatedRelation = wrappedRelation.value
                        .filter((r) => DataviewService.wrapLiteral(r).type === "link") as Link[];
                } else {
                    throw new Error(`Invalid relation type: ${wrappedRelation.type}. Value: ${wrappedRelation.value}`);
                }

                return new Rollup(validatedRelation).dispatch(configColumn.rollup_action, configColumn.rollup_key);
            } catch (e) {
                LOGGER.error(`Error dispatching rollup of ${configColumn.asociated_relation_id} relation: `, e);
                return "";
            }
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}