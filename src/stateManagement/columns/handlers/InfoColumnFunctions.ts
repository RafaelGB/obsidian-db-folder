import { ColumnOption, RowSelectOption } from "cdm/ComponentsModel";
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

        implementation.info.getAllColumns = () => {
            return get().columns;
        }

        implementation.info.getColumnOptions = (id: string): ColumnOption[] => {
            const opColumn = get().columns.find((c) => c.id === id);
            if (!opColumn) {
                return [];
            }
            return opColumn.options
                .filter(
                    (option: RowSelectOption) =>
                        option && option.label !== undefined && option.label !== null
                )
                .sort((a, b) => a.label.localeCompare(b.label))
                .map((option: RowSelectOption) => ({
                    value: option.label,
                    label: option.label,
                    color: option.backgroundColor,
                }))
        };

        response.implementation = implementation;
        return this.goNext(response);
    }
}