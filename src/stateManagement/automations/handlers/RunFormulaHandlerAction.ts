import { RowDataType } from "cdm/FolderModel";
import { AutomationState, DbInfo, TableActionResponse } from "cdm/TableStateInterface";
import { FormulaService } from "services/FormulaService";
import { LOGGER } from "services/Logger";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class RunFormulaHandlerAction extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { implementation, get } = tableActionResponse;
        implementation.info.runFormula = (input: string, row: RowDataType, dbInfo: DbInfo) => {
            try {
                return FormulaService.evalWith(input, row, dbInfo, get().formula);
            } catch (e) {
                LOGGER.error(`Error evaluating formula from row ${row.__note__.filepath}: `, e);
                return "";
            }
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}