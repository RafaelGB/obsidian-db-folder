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
        }),
    )();
}
export default useColumnsStore;