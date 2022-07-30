import { RowDataType, TableColumn } from "cdm/FolderModel";
import { DataState } from "cdm/TableStateInterface";
import create from "zustand";

const useDataStore = (rows: RowDataType[]) => {
    return create<DataState>()(
        (set) => ({
            rows: rows,
            add: (row: RowDataType) => set((state) => ({ rows: [...state.rows, row] })),
            remove: (row: RowDataType) => set((state) => ({ rows: state.rows.filter((r) => r.__note__.getFile().path !== row.__note__.getFile().path) })),
            removeDataOfColumn: (column: TableColumn) => set((state) => {
                const newRows = [...state.rows];
                newRows.forEach((row) => {
                    delete row[column.id];
                }
                );
                return { rows: newRows };
            }),
        }),
    )();
}
export default useDataStore;