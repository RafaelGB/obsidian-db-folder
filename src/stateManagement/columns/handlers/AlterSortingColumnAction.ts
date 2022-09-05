import { TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import obtainInitialType from "helpers/InitialType";
import { AbstractTableAction } from "stateManagement/AbstractTableAction";

export default class AlterSortingColumnHandlerAction extends AbstractTableAction<ColumnsState> {
    handle(tableActionResponse: TableActionResponse<ColumnsState>): TableActionResponse<ColumnsState> {
        const { view, set, implementation } = tableActionResponse;
        implementation.actions.alterSorting = (column: TableColumn) =>
            set((updater) => {
                const newColumns = [...updater.columns];
                const index = newColumns.findIndex((c) => c.id === column.id);
                newColumns[index].isSorted = column.isSorted;
                newColumns[index].isSortedDesc = column.isSortedDesc;
                newColumns[index].sortIndex = column.sortIndex;
                view.diskConfig.updateColumnProperties(
                    column.id,
                    {
                        isSorted: column.isSorted,
                        isSortedDesc: column.isSortedDesc,
                        sortIndex: column.sortIndex,
                    }
                );
                // reordering index in case of current was removed
                if (column.sortIndex === -1) {
                    const sortedColumns = obtainInitialType(newColumns);
                    sortedColumns.sortBy.forEach((sortElem, index) => {
                        view.diskConfig.updateColumnProperties(
                            sortElem.id,
                            {
                                isSorted: true,
                                isSortedDesc: sortElem.desc,
                                sortIndex: index,
                            }
                        );
                    });
                }
                return { columns: newColumns };
            });

        tableActionResponse.implementation = implementation;
        return this.goNext(tableActionResponse);

    }
}