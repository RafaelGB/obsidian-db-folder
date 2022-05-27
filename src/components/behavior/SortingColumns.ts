import { TableColumn, TableDataType } from "cdm/FolderModel";
import { LOGGER } from "services/Logger";

type SortedType = {
    id: string;
    desc: boolean;
}
export function generateSortedColumns(tableDataType: TableDataType, currentCol: TableColumn, isSortedDesc: boolean): SortedType[] {
    LOGGER.debug(`=>generateSortedColumns currentCol ${currentCol.id} isSortedDesc ${isSortedDesc}`);
    const sortArray: SortedType[] = [];
    tableDataType.columns
        // Filter if col is already sorted or is current col
        .filter(col => col.id === currentCol.id || col.isSorted)
        .map((col) => {
            if (currentCol.id === col.id) {
                // When is current col
                if (currentCol.isSorted && currentCol.isSortedDesc === isSortedDesc) {
                    // If sort direction is the same, remove sort
                    col.isSorted = false;
                    tableDataType.view.diskConfig.updateColumnProperties(
                        currentCol.id,
                        {
                            isSorted: false,
                        }
                    );
                } else {
                    // If sort direction is different or not sorted, set sort
                    col.isSorted = true;
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
            return col;
        });
    LOGGER.debug(`<=generateSortedColumns`, `sortArray ${JSON.stringify(sortArray)}`);
    return sortArray;
}