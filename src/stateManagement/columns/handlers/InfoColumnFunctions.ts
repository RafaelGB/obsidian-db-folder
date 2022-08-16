import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class InfoColumnFunctions extends AbstractTableAction<ColumnsState> {
    handle(response: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { get, implementation } = response;
        implementation.info.getValueOfAllColumnsAsociatedWith = <K extends keyof TableColumn>(key: K) => {
            return get().columns.map(col => col[key]);
        };

        implementation.info.getVisibilityRecord = () => {
            const visibilityRecord: Record<string, boolean> = {};
            get().columns.map(
                (c) => (visibilityRecord[c.id] = c.isHidden === undefined ? true : !c.isHidden)
            );
            return visibilityRecord;
        };

        response.implementation = implementation;
        return this.goNext(response);
    }
}