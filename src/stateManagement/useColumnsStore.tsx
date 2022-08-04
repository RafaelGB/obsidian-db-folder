import { RowSelectOption } from "cdm/ComponentsModel";
import { DatabaseColumn, OptionSelect } from "cdm/DatabaseModel";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { ColumnsState, TableActionResponse } from "cdm/TableStateInterface";
import { DatabaseView } from "DatabaseView";
import { randomColor } from "helpers/Colors";
import { InputType } from "helpers/Constants";
import { obtainUniqueOptionValues } from "helpers/SelectHelper";
import { dbTrim } from "helpers/StylesHelper";
import create from "zustand";
import column_state_actions from "stateManagement/columns/ColumnsStateActions";

const useColumnsStore = (view: DatabaseView) => {
  return create<ColumnsState>()((set) => {
    const tableActionResponse: TableActionResponse<ColumnsState> = {
      view: view,
      set: set,
      implementation: {
        columns: view.columns,
        shadowColumns: view.shadowColumns,
        addToLeft: null, // chain
        addToRight: null, // chain
        remove: null, // chain
        alterSorting: null, // chain
        addOptionToColumn: (
          column: TableColumn,
          option: string,
          backgroundColor: string
        ) =>
          set((updater) => {
            const optionIndex = updater.columns.findIndex(
              (col: TableColumn) => col.id === column.id
            );
            const newOption: RowSelectOption = {
              label: option,
              backgroundColor: backgroundColor,
            };

            updater.columns[optionIndex].options.push(newOption);
            view.diskConfig.updateColumnProperties(column.id, {
              options: updater.columns[optionIndex].options,
            });
            return { columns: updater.columns };
          }),
        alterColumnType: (
          column: TableColumn,
          input: string,
          parsedRows?: RowDataType[]
        ) =>
          set((updater) => {
            const typeIndex = updater.columns.findIndex(
              (col: TableColumn) => col.id === column.id
            );
            if (updater.columns[typeIndex].input === input) {
              // If the type is the same, do nothing
              return {};
            }

            const alteredColumns = [...updater.columns];
            // Save the new type in the disk config
            view.diskConfig.updateColumnProperties(column.id, {
              input: input,
            });
            alteredColumns[typeIndex].input = input;
            switch (input) {
              case InputType.SELECT:
              case InputType.TAGS:
                const options: OptionSelect[] = [];
                // Generate selected options
                parsedRows.forEach((row) => {
                  if (row[column.id]) {
                    options.push({
                      label: row[column.id]?.toString(),
                      backgroundColor: randomColor(),
                    });
                  }
                });
                alteredColumns[typeIndex].options =
                  obtainUniqueOptionValues(options);
                break;
              default:
              /**
               * GENERIC COLUMN TYPE Doesn't have options
               * Aplied to:
               * - TEXT
               * - NUMBER
               * - CALENDAR
               * - CALENDAR_TIME
               * - CHECKBOX
               */
            }
            return { columns: alteredColumns };
          }),
        alterColumnLabel: (column: TableColumn, label: string) =>
          set((updater) => {
            const labelIndex = updater.columns.findIndex(
              (col: TableColumn) => col.id === column.id
            );
            const newKey = dbTrim(label);
            updater.columns[labelIndex].label = label;
            updater.columns[labelIndex].id = newKey;
            updater.columns[labelIndex].key = newKey;
            updater.columns[labelIndex].accessorKey = newKey;
            // Update configuration & row files on disk
            view.diskConfig.updateColumnKey(column.id, newKey, label);
            return { columns: updater.columns };
          }),
        alterColumnSize: (columnSizing: Record<string, number>) =>
          set((updater) => {
            const alteredColumns = [...updater.columns];
            Object.keys(columnSizing)
              .filter((key) => columnSizing[key] !== undefined)
              .map((key) => {
                // Persist on disk
                view.diskConfig.updateColumnProperties(key, {
                  width: columnSizing[key],
                });
                // Persist on memory
                const indexCol = alteredColumns.findIndex(
                  (col: TableColumn) => col.key === key
                );
                alteredColumns[indexCol].width = columnSizing[key];
              });
            return { columns: alteredColumns };
          }),
      },
    };

    const columnActions = column_state_actions.run(tableActionResponse);
    return columnActions.implementation;
  });
};

export default useColumnsStore;
