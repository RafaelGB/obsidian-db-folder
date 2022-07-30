import { TableColumn } from "cdm/FolderModel";
import { ColumnsState } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import create from "zustand";

const useColumnsStore = (view: DatabaseView) => {
    return create<ColumnsState>()(
        (set) => ({
            state: view.columns,
            add: (column: TableColumn, position: number) => set((updater) => {
                const newColumns = [...updater.state];
                newColumns.splice(position, 0, column);
                return { state: newColumns };
            }),
            remove: (column: TableColumn) => set((updater) => {
                view.diskConfig.removeColumn(column.id);
                return { state: updater.state.filter((c) => c.id !== column.id) }
            }),
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