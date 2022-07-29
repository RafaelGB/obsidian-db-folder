import { SortingState } from "@tanstack/react-table";
import { TableColumn } from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import { LOGGER } from "services/Logger";

export function generateSortedColumns(view: DatabaseView, currentCol: TableColumn, isSortedDesc: boolean): SortingState {
    LOGGER.debug(`=>generateSortedColumns currentCol ${currentCol.id} isSortedDesc ${isSortedDesc}`);
    const sortArray: SortingState = [];
    view.columns
        // Filter if col is already sorted or is current col
        .filter(col => col.id === currentCol.id || col.isSorted)
        .forEach((col) => {
            if (currentCol.id === col.id) {
                // When is current col
                if (currentCol.isSorted && currentCol.isSortedDesc === isSortedDesc) {
                    // If sort direction is the same, remove sort
                    view.diskConfig.updateColumnProperties(
                        currentCol.id,
                        {
                            isSorted: false,
                        }
                    );
                } else {
                    // If sort direction is different or not sorted, set sort
                    sortArray.push({ id: currentCol.id, desc: isSortedDesc });
                    view.diskConfig.updateColumnProperties(
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