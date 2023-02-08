import { TableColumn } from "cdm/FolderModel";
import { AutomationState, TableActionResponse } from "cdm/TableStateInterface";
import { Literal } from "obsidian-dataview";
import { FormulaService } from "services/FormulaService";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class DispatchFooterHandlerAcgion extends AbstractTableAction<AutomationState> {
    handle(tableActionResponse: TableActionResponse<AutomationState>): TableActionResponse<AutomationState> {
        const { implementation, get } = tableActionResponse;
        implementation.info.dispatchFooter = (column: TableColumn, values: Literal[]) => {
            return FormulaService.evalFooterWith(column, values, get().formula);
        };

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}