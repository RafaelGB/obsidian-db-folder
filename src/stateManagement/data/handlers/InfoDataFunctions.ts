import { DataState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class InfoDataFunctions extends AbstractTableAction<DataState> {
    handle(response: TableActionResponse<DataState>): TableActionResponse<DataState> {
        const { get, implementation } = response;
        implementation.info.getRows = () => {
            return get().rows;
        };

        response.implementation = implementation;
        return this.goNext(response);
    }
}