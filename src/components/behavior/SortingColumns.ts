import { SortedType } from "cdm/DatabaseModel";
import { TableColumn, TableDataType } from "cdm/FolderModel";
import { LOGGER } from "services/Logger";

export function generateSortedColumns(tableDataType: TableDataType, currentCol: TableColumn, isSortedDesc: boolean): SortedType[] {
    LOGGER.debug(`=>generateSortedColumns currentCol ${currentCol.id} isSortedDesc ${isSortedDesc}`);
    const sortArray: SortedType[] = [];
    tableDataType.view.columns
        // Filter if col is already sorted or is current col
        .filter(col => col.id === currentCol.id || col.isSorted)
        .forEach((col) => {
            if (currentCol.id === col.id) {
                // When is current col
                if (currentCol.isSorted && currentCol.isSortedDesc === isSortedDesc) {
                    // If sort direction is the same, remove sort
                    tableDataType.view.diskConfig.updateColumnProperties(
                        currentCol.id,
                        {
                            isSorted: false,
                        }
                    );
                } else {
                    // If sort direction is different or not sorted, set sort
                    sortArray.push({ id: currentCol.id, desc: isSortedDesc });
                    tableDataType.view.diskConfig.updateColumnProperties(
                        currentCol.id,
                        {
                            isSorted: true,
                            isSortedDesc: isSortedDesc,
                        }
                    );
                }

            } else {
                // When is not current col
                sortArray.push({ id: col.id, desc: col.isSortedDesc });
            }
        });
    LOGGER.debug(`<=generateSortedColumns`, `sortArray ${JSON.stringify(sortArray)}`);
    return sortArray;
}