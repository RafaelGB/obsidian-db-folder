import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterColumnSizeHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.alterColumnSize = (columnSizing: Record<string, number>) =>
            set((updater) => {
                const alteredColumns = [...updater.columns];
                Object.keys(columnSizing)
                    .filter((key) => columnSizing[key] !== undefined)
                    .map((key) => {
                        // Persist on disk
                        view.diskConfig.updateColumnProperties(key, {
                            width: columnSizing[key],
                        });
                        // Persist on memory
                        const indexCol = alteredColumns.findIndex(
                            (col: TableColumn) => col.key === key
                        );
                        alteredColumns[indexCol].width = columnSizing[key];
                    });
                return { columns: alteredColumns };
            });
        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);
    }
}
