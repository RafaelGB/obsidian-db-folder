import { SortingState } from "@tanstack/react-table";
import { ColumnSortingState } from "cdm/TableStateInterface"
import { CustomView } from "views/AbstractView";
import { create } from "zustand"

const useSortingStore = (view: CustomView) => {
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