import { DatabaseColumn } from "cdm/DatabaseModel";
import { TableColumn } from "cdm/FolderModel";
import { ColumnsState } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import {
  DEFAULT_COLUMN_CONFIG,
  InputType,
  TableColumnsTemplate,
} from "helpers/Constants";
import create from "zustand";
import { persist } from "zustand/middleware";

const useColumnsStore = (view: DatabaseView) => {
  console.log("initColumnsStore", view.columns);
  return create<ColumnsState>()(
    persist((set) => ({
      columns: view.columns,
      shadowColumns: view.shadowColumns,
      addToLeft: (column: TableColumn) =>
        set((updater) => {
          const columnInfo = generateNewColumnInfo(
            column.position - 1,
            updater.columns,
            updater.shadowColumns
          );
          const newLeftColumn: DatabaseColumn = {
            input: InputType.TEXT,
            accessorKey: columnInfo.name,
            key: columnInfo.name,
            label: columnInfo.label,
            position: columnInfo.position,
            config: DEFAULT_COLUMN_CONFIG,
          };
          view.diskConfig.addColumn(columnInfo.name, newLeftColumn);
          const leftIndex = updater.columns.findIndex(
            (column) => column.id === column.id
          );
          const newColumns = [
            ...updater.columns.slice(0, leftIndex),
            {
              ...TableColumnsTemplate,
              input: newLeftColumn.input,
              id: newLeftColumn.key,
              label: newLeftColumn.label,
              key: newLeftColumn.key,
              accessorKey: newLeftColumn.accessorKey,
              position: newLeftColumn.position,
              csvCandidate: true,
              config: newLeftColumn.config,
            },
            ...updater.columns.slice(leftIndex, updater.columns.length),
          ];
          return { columns: newColumns };
        }),
      addToRight: (column: TableColumn) =>
        set((updater) => {
          const newColumns = [...updater.columns];
          newColumns.splice(1, 0, column);
          return { columns: newColumns };
        }),
      remove: (column: TableColumn) =>
        set((updater) => {
          view.diskConfig.removeColumn(column.id);
          const filtered = updater.columns.filter((c) => c.id !== column.id);
          console.log("filtered", filtered);
          return { columns: filtered };
        }),
      alterSorting: (column: TableColumn) =>
        set((updater) => {
          const newColumns = [...updater.columns];
          const index = newColumns.findIndex((c) => c.id === column.id);
          newColumns[index].isSorted = column.isSorted;
          newColumns[index].isSortedDesc = column.isSortedDesc;
          return { columns: newColumns };
        }),
    }))
  );
};
/**
 * Adjust width of the columns when add a new column.
 * @param wantedPosition
 * @returns
 */
function generateNewColumnInfo(
  wantedPosition: number,
  columns: TableColumn[],
  shadowColumns: TableColumn[]
) {
  let columnNumber = columns.length - shadowColumns.length;
  // Check if column name already exists
  while (columns.find((o: any) => o.id === `newColumn${columnNumber}`)) {
    columnNumber++;
  }
  const columnId = `newColumn${columnNumber}`;
  const columnLabel = `New Column ${columnNumber}`;
  return { name: columnId, position: wantedPosition, label: columnLabel };
}

// function newColumn(): TableColumn {}
// const newLeftColumn: DatabaseColumn = {
//   input: InputType.TEXT,
//   accessorKey: action.columnInfo.name,
//   key: action.columnInfo.name,
//   label: action.columnInfo.label,
//   position: action.columnInfo.position,
//   config: DEFAULT_COLUMN_CONFIG,
// };
export default useColumnsStore;
