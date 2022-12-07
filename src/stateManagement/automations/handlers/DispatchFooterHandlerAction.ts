import { Row } from "@tanstack/react-table";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { Literal } from "obsidian-dataview";
import { LOGGER } from "services/Logger";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class DispatchFooterHandlerAcgion extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { implementation, get } = tableActionResponse;
        implementation.info.dispatchFooter = (column: TableColumn, colValues: Literal[]) => {
            return this.proxyFooter(column, colValues, get().formula);
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }

    private evalInput(column: TableColumn, colValues: Literal[], db: {
        [key: string]: unknown;
    }): Literal {
        const input = column.config.footer_formula;
        const dynamicJS = 'return `' + input + '`';
        const func = new Function('column', 'colValues', 'db', dynamicJS);
        const result = func(column, colValues, db);
        if (result === "undefined" || result === "null") {
            return '';
        }
        return result;
    }

    private proxyFooter(column: TableColumn, colValues: Literal[], db: {
        [key: string]: unknown;
    }): Literal {
        try {
            return this.evalInput(column, colValues, db);
        } catch (e) {
            LOGGER.error(`Error evaluating footer formula from column ${column.key}: `, e);
            return "";
        }
    }
}