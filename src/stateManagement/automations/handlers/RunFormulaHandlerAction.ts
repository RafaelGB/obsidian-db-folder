import { RowDataType } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { Literal } from "obsidian-dataview";
import { LOGGER } from "services/Logger";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RunFormulaHandlerAction extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { implementation, get } = tableActionResponse;
        implementation.info.runFormula = (input: string, row: RowDataType, ddbbConfig: LocalSettings) => {
            return this.proxyFunction(input, row, ddbbConfig, get().formula);
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
    private evalInput(input: string, row: RowDataType, config: LocalSettings, db: {
        [key: string]: unknown;
    }): Literal {
        const dynamicJS = 'return `' + input + '`';
        const func = new Function('row', 'ddbbConfig', 'db', dynamicJS);
        const result = func(row, config, db);
        if (result === "undefined" || result === "null") {
            return '';
        }
        return result;
    }
    private proxyFunction(input: string, row: RowDataType, config: LocalSettings, db: {
        [key: string]: unknown;
    }): Literal {
        try {
            return this.evalInput(input, row, config, db);
        } catch (e) {
            LOGGER.error(`Error evaluating formula from row ${row.__note__.filepath}: `, e);
            return "";
        }
    }

}