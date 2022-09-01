import { SortingState } from "@tanstack/react-table";
import { ColumnSortingState } from "cdm/TableStateInterface"
import { DatabaseView } from "DatabaseView";
import create from "zustand"

const useSortingStore = (view: DatabaseView) => {
    return create<ColumnSortingState>()(
        (set) => ({
            sortBy: view.initial.sortBy,
            actions: {
                alterSorting: (alternativeSorting: SortingState) => set(() => ({ sortBy: alternativeSorting }))
            }
        }),
    );
}
export default useSortingStore;