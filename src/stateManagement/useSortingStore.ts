import { SortingState } from "@tanstack/react-table";
import { TableColumn } from "cdm/FolderModel";
import { ColumnSortingState } from "cdm/TableStateInterface"
import { generateSortedColumns } from "components/behavior/SortingColumns";
import { DatabaseView } from "DatabaseView";
import create from "zustand"

const useSortingStore = (sorting: SortingState, view: DatabaseView) => {
    return create<ColumnSortingState>()(
        (set) => ({
            state: sorting,
            modify: (alternativeSorting: SortingState) => set((state) => ({ state: alternativeSorting })),
            generateSorting: (currentCol: TableColumn, isSortedDesc: boolean) => {
                return generateSortedColumns(
                    view,
                    currentCol,
                    isSortedDesc
                )
            }
        }),
    )();
}
export default useSortingStore;