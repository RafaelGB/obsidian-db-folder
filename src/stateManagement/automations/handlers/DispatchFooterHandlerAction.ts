import { TableColumn } from "cdm/FolderModel";
import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { Literal } from "obsidian-dataview";
import { LOGGER } from "services/Logger";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class DispatchFooterHandlerAcgion extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { implementation, get } = tableActionResponse;
        implementation.info.dispatchFooter = (column: TableColumn, values: Literal[]) => {
            return this.proxyFooter(column, values, get().formula);
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }

    private evalInput(column: TableColumn, values: Literal[], db: {
        [key: string]: unknown;
    }): Literal {
        const input = column.config.footer_formula;
        const dynamicJS = 'return `' + input + '`';
        const func = new Function('column', 'values', 'db', dynamicJS);
        const result = func(column, values, db);
        if (result === "undefined" || result === "null") {
            return '';
        }
        return result;
    }

    private proxyFooter(column: TableColumn, values: Literal[], db: {
        [key: string]: unknown;
    }): Literal {
        try {
            return this.evalInput(column, values, db);
        } catch (e) {
            LOGGER.error(`Error evaluating footer formula from column ${column.key}: `, e);
            return "";
        }
    }
}