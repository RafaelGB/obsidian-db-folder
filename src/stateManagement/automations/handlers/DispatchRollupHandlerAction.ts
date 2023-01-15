import Rollup from "lib/Rollup";
import { ConfigColumn } from "cdm/FolderModel";
import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { Link, Literal } from "obsidian-dataview";
import { DataviewService } from "services/DataviewService";
import { LOGGER } from "services/Logger";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";
import { ROLLUP_ACTIONS } from "helpers/Constants";

export default class DispatchRollupHandlerAction extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { implementation } = tableActionResponse;
        implementation.info.dispatchRollup = (configColumn: ConfigColumn, relation: Literal) => {
            try {
                const validatedRelation = this.obtainRelation(relation);
                if (ROLLUP_ACTIONS.FORMULA === configColumn.rollup_action) {
                    return this.evalRollupFormulaInput(
                        configColumn.formula_query,
                        configColumn.rollup_key,
                        validatedRelation,
                        tableActionResponse.get().formula
                    );
                }

                return new Rollup(validatedRelation)
                    .dispatch(
                        configColumn.rollup_action,
                        configColumn.rollup_key
                    );
            } catch (e) {
                LOGGER.error(`Error dispatching rollup of ${configColumn.asociated_relation_id} relation: `, e);
                return "";
            }
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }

    private obtainRelation(relation: Literal): Link[] {
        let validatedRelation: Link[] = [];
        const wrappedRelation = DataviewService.wrapLiteral(relation);
        if (wrappedRelation.type === "link") {
            validatedRelation.push(wrappedRelation.value);
        } else if (wrappedRelation.type === "array") {
            validatedRelation = wrappedRelation.value
                .filter((r) => DataviewService.wrapLiteral(r).type === "link") as Link[];
        } else {
            throw new Error(`Invalid relation type: ${wrappedRelation.type}. Value: ${wrappedRelation.value}`);
        }
        return validatedRelation;
    }

    private evalRollupFormulaInput(input: string, rollupKey: string, relations: Link[], db: {
        [key: string]: unknown;
    }): Literal {
        const dynamicJS = 'return `' + input + '`';
        const func = new Function('relations', 'rollupKey', 'db', dynamicJS);
        const result = func(new Rollup(relations).getPages(), rollupKey, db);
        if (result === "undefined" || result === "null") {
            return '';
        }
        return result;
    }
}