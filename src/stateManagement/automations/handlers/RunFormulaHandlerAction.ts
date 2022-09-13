import { RowDataType } from "cdm/FolderModel";
import { LocalSettings } from "cdm/SettingsModel";
import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { Literal } from "obsidian-dataview";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RunFormulaHandlerAction extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { implementation, get } = tableActionResponse;
        implementation.info.runFormula = (input: string, row: RowDataType, ddbbConfig: LocalSettings) => {
            return this.evalInput(input, row, ddbbConfig, get().formula);
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
    evalInput(input: string, row: RowDataType, ddbbConfig: LocalSettings, formulas: {
        [key: string]: unknown;
    }): Literal {
        const dynamicJS = 'return `' + input + '`';
        const func = new Function('row', 'ddbbConfig', 'formulas', dynamicJS);
        return func(row, ddbbConfig, formulas);
    }
}