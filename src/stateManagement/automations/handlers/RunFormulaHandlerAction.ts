import { RowDataType } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { Literal } from "obsidian-dataview";
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
    evalInput(input: string, row: RowDataType, config: LocalSettings, db: {
        [key: string]: unknown;
    }): Literal {
        const dynamicJS = 'return `' + input + '`';
        const func = new Function('row', 'ddbbConfig', 'db', dynamicJS);
        return func(row, config, db);
    }
    proxyFunction(input: string, row: RowDataType, config: LocalSettings, db: {
        [key: string]: unknown;
    }): Literal {
        try {
            return this.evalInput(input, row, config, db);
        } catch (e) {
            return `Error: ${e}`;
        }
    }

}