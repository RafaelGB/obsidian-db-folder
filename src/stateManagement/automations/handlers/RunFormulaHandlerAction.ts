import { RowDataType } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { AutomationState, DbInfo, TableActionResponse } from "cdm/TableStateInterface";
import { Literal } from "obsidian-dataview";
import { LOGGER } from "services/Logger";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RunFormulaHandlerAction extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { implementation, get } = tableActionResponse;
        implementation.info.runFormula = (input: string, row: RowDataType, dbInfo: DbInfo) => {
            try {
                return this.evalInput(input, row, dbInfo, get().formula);
            } catch (e) {
                LOGGER.error(`Error evaluating formula from row ${row.__note__.filepath}: `, e);
                return "";
            }
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
    private evalInput(input: string, row: RowDataType, info: DbInfo, db: {
        [key: string]: unknown;
    }): Literal {
        LOGGER.debug(`Evaluating formula from row ${row.__note__.filepath}: `, input);
        const dynamicJS = 'return `' + input + '`';
        const func = new Function('row', 'info', 'db', dynamicJS);
        const result = func(row, info, db);
        if (result === "undefined" || result === "null") {
            return '';
        }
        return result;
    }
}