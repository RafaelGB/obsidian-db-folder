import { TableColumn } from "cdm/FolderModel";
import { ColumnsState } from "cdm/TableStateInterface";
import create from "zustand";

const useColumnsStore = (columns: TableColumn[]) => {
    return create<ColumnsState>()(
        (set) => ({
            columns: columns,
            add: (column: TableColumn, position: number) => set((state) => {
                const newColumns = [...state.columns];
                newColumns.splice(position, 0, column);
                return { columns: newColumns };
            }),
            remove: (column: TableColumn) => set((state) => ({ columns: state.columns.filter((c) => c.id !== column.id) })),
        }),
    )();
}
export default useColumnsStore;