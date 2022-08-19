import { SortingState } from "@tanstack/react-table";
import { TableColumn } from "cdm/FolderModel";
import { ColumnSortingState } from "cdm/TableStateInterface"
import { generateSortedColumns } from "components/behavior/SortingColumns";
import { DatabaseView } from "DatabaseView";
import create from "zustand"

const useSortingStore = (view: DatabaseView) => {
    return create<ColumnSortingState>()(
        (set) => ({
            sortBy: view.initial.sortBy,
            actions: {
                alterSorting: (alternativeSorting: SortingState) => set((state) => ({ sortBy: alternativeSorting }))
            },
            info: {
                generateSorting: (currentCol: TableColumn, isSortedDesc: boolean) => {
                    return generateSortedColumns(
                        view,
                        currentCol,
                        isSortedDesc
                    )
                }
            }
        }),
    );
}
export default useSortingStore;