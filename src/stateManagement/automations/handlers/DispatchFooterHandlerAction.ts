import { Row } from "@tanstack/react-table";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { Literal } from "obsidian-dataview";
import { LOGGER } from "services/Logger";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class DispatchFooterHandlerAcgion extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { implementation, get } = tableActionResponse;
        implementation.info.dispatchFooter = (column: TableColumn, rows: Row<RowDataType>[]) => {
            return this.proxyFooter(column, rows, get().formula);
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }

    private evalInput(column: TableColumn, rows: Row<RowDataType>[], db: {
        [key: string]: unknown;
    }): Literal {
        const input = column.config.footer_formula;
        const dynamicJS = 'return `' + input + '`';
        const func = new Function('column', 'rows', 'db', dynamicJS);
        const result = func(column, rows, db);
        if (result === "undefined" || result === "null") {
            return '';
        }
        return result;
    }

    private proxyFooter(column: TableColumn, rows: Row<RowDataType>[], db: {
        [key: string]: unknown;
    }): Literal {
        try {
            return this.evalInput(column, rows, db);
        } catch (e) {
            LOGGER.error(`Error evaluating footer formula from column ${column.key}: `, e);
            return "";
        }
    }
}