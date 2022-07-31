import { ColumnSort } from "@tanstack/react-table";
import { InitialState } from "cdm/TableStateInterface"
import { DatabaseView } from "DatabaseView"
import create from "zustand"

const useInitialTypeStore = (view: DatabaseView) => {
    return create<InitialState>()(
        (set) => ({
            state: view.initial,
            alterSortBy: (sortBy: ColumnSort[]) => {
                set(
                    (updater) => {
                        updater.state.sortBy = sortBy;
                        return {
                            state: updater.state
                        }
                    }
                )
            }
        }),
    );
}
export default useInitialTypeStore;