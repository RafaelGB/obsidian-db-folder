import { TableColumn } from "cdm/FolderModel";
import { ColumnsState } from "cdm/TableStateInterface";
import create from "zustand";

const useColumnsStore = (columns: TableColumn[]) => {
    return create<ColumnsState>()(
        (set) => ({
            state: columns,
            add: (column: TableColumn, position: number) => set((updater) => {
                const newColumns = [...updater.state];
                newColumns.splice(position, 0, column);
                return { state: newColumns };
            }),
            remove: (column: TableColumn) => set((updater) => ({ state: updater.state.filter((c) => c.id !== column.id) })),
            alterSorting: (column: TableColumn) => set((updater) => {
                const newColumns = [...updater.state];
                const index = newColumns.findIndex((c) => c.id === column.id);
                newColumns[index].isSorted = column.isSorted;
                newColumns[index].isSortedDesc = column.isSortedDesc;
                return { state: newColumns };
            }
            ),
        }),
    )();
}
export default useColumnsStore;