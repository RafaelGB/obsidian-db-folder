import React, { useEffect, useReducer } from "react";
import update from "immutability-helper";
import {
  ActionTypes,
  DataTypes,
  MetadataColumns,
  TableColumnsTemplate,
  UpdateRowOptions,
} from "helpers/Constants";
import { TableColumn, TableDataType, RowDataType } from "cdm/FolderModel";
import { LOGGER } from "services/Logger";
import { ActionType } from "react-table";
import { VaultManagerDB } from "services/FileManagerService";
import { moveFile, updateRowFile } from "helpers/VaultManagement";
import { randomColor } from "helpers/Colors";
import { DatabaseColumn, RowDatabaseFields } from "cdm/DatabaseModel";
import NoteInfo from "services/NoteInfo";
import { DataviewService } from "services/DataviewService";

export function databaseReducer(state: TableDataType, action: ActionType) {
  LOGGER.debug(
    `<=>databaseReducer action: ${action.type} value: ${action.value}`
  );
  /** database configuration */
  const dbconfig = state.view.diskConfig.yaml.config;
  // Check if action exists
  if (!action) {
    return state;
  }
  switch (action.type) {
    /**
     * Add option to column
     */
    case ActionTypes.ADD_OPTION_TO_COLUMN:
      const optionIndex = state.columns.findIndex(
        (column: TableColumn) => column.id === action.columnId
      );
      return update(state, {
        columns: {
          [optionIndex]: {
            options: {
              $push: [
                {
                  label: action.option,
                  backgroundColor: action.backgroundColor,
                },
              ],
            },
          },
        },
      });
    /**
     * Add new row into table
     */
    case ActionTypes.ADD_ROW:
      const filename = `${state.view.file.parent.path}/${action.filename}.md`;
      const rowRecord: RowDatabaseFields = { inline: {}, frontmatter: {} };
      state.columns
        .filter((column: TableColumn) => !column.isMetadata)
        .forEach((column: TableColumn) => {
          if (column.isInline) {
            rowRecord.inline[column.key] = "";
          } else {
            rowRecord.frontmatter[column.key] = "";
          }
        });
      // Add note to persist row
      VaultManagerDB.create_markdown_file(
        state.view.file.parent,
        action.filename,
        rowRecord
      );

      const row: RowDataType = {
        ...rowRecord.frontmatter,
        ...rowRecord.inline,
        id: state.data.length + 1,
        note: new NoteInfo(
          {
            ...rowRecord.frontmatter,
            ...rowRecord.inline,
            file: { path: filename },
          },
          state.data.length + 1
        ),
        [MetadataColumns.FILE]: `[[${filename}|${action.filename}]]`,
      };
      // TODO add typing
      return update(state as any, {
        data: { $push: [row] },
      });
    /**
     * Modify column label of its header.
     * Update key of column in all rows
     */
    case ActionTypes.UPDATE_COLUMN_LABEL:
      const update_column_label_index = state.columns.findIndex(
        (column: any) => column.id === action.columnId
      );
      // Update configuration & row files on disk
      state.view.diskConfig
        .updateColumnKey(action.columnId, action.newKey, action.label)
        .then(async () => {
          // Once the column is updated, update the rows in case the key is changed

          await Promise.all(
            state.data.map(async (row: RowDataType) => {
              await updateRowFile(
                row.note.getFile(),
                action.columnId,
                action.newKey,
                state,
                UpdateRowOptions.COLUMN_KEY
              );
            })
          );
        });
      return update(state, {
        skipReset: { $set: true },
        // Modify column visually with the new label
        columns: {
          $set: [
            ...state.columns.slice(0, update_column_label_index),
            {
              ...state.columns[update_column_label_index],
              label: action.label,
              id: action.newKey,
              key: action.newKey,
              accessor: action.newKey,
            },
            ...state.columns.slice(
              update_column_label_index + 1,
              state.columns.length
            ),
          ],
        },
        // Modify data visually with the new key
        data: {
          $set: state.data.map((row: RowDataType) => {
            row[action.newKey] = row[action.columnId];
            delete row[action.columnId];
            return row;
          }),
        },
      });

    /**
     * Modify type of column and adapt the data.
     * Update type on disk
     */
    case ActionTypes.UPDATE_COLUMN_TYPE:
      const typeIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      /** Check if type is changed */
      if (state.columns[typeIndex].dataType === action.dataType) {
        return state;
      }
      /** If changed, then parsed information */
      // Update configuration on disk
      state.view.diskConfig.updateColumnProperties(action.columnId, {
        input: action.dataType,
      });
      // Parse data
      const parsedData = state.data.map((row: any) => ({
        ...row,
        [action.columnId]: DataviewService.parseLiteral(
          row[action.columnId],
          action.dataType // Destination type to parse
        ),
      }));
      // Update state
      switch (action.dataType) {
        case DataTypes.SELECT:
          const options: any = [];
          // Generate selected options
          parsedData.forEach((row) => {
            if (row[action.columnId]) {
              options.push({
                label: row[action.columnId],
                backgroundColor: randomColor(),
              });
            }
          });
          // Update column to SELECT type
          return update(state, {
            skipReset: { $set: true },
            columns: {
              $set: [
                ...state.columns.slice(0, typeIndex),
                {
                  ...state.columns[typeIndex],
                  dataType: action.dataType,
                  options: [...state.columns[typeIndex].options, ...options],
                },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
            },
            data: {
              $set: parsedData,
            },
          });
        default:
          /**
           * GENERIC update change
           * Update column dataType & parsed data
           * Aplied to:
           * - TEXT
           * - NUMBER
           * - CALENDAR
           */
          console.log("GENERIC update change");
          return update(state, {
            skipReset: { $set: true },
            columns: {
              $set: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
            },
            data: {
              $set: parsedData,
            },
          });
      }
    /**
     * Add new column to the table to the left of the column with the given id
     * and save it on disk
     */
    case ActionTypes.ADD_COLUMN_TO_LEFT:
      const leftIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );

      const newLeftColumn: DatabaseColumn = {
        input: DataTypes.TEXT,
        accessor: action.columnInfo.name,
        key: action.columnInfo.name,
        label: action.columnInfo.label,
        position: action.columnInfo.position,
      };
      // Update configuration on disk
      state.view.diskConfig.addColumn(action.columnInfo.name, newLeftColumn);
      // Update state
      return update(state, {
        skipReset: { $set: true },
        columns: {
          $set: [
            ...state.columns.slice(0, leftIndex),
            {
              ...TableColumnsTemplate,
              dataType: newLeftColumn.input,
              id: newLeftColumn.accessor,
              label: newLeftColumn.label,
              key: newLeftColumn.key,
              accessor: newLeftColumn.accessor,
              position: newLeftColumn.position,
              csvCandidate: true,
            },
            ...state.columns.slice(leftIndex, state.columns.length),
          ],
        },
      });
    /**
     * Add new column to the table to the right of the column with the given id
     * and save it on disk
     */
    case ActionTypes.ADD_COLUMN_TO_RIGHT:
      const rightIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );

      const newRIghtColumn: DatabaseColumn = {
        input: DataTypes.TEXT,
        accessor: action.columnInfo.name,
        key: action.columnInfo.name,
        label: action.columnInfo.label,
        position: action.columnInfo.position,
      };
      // Update configuration on disk
      state.view.diskConfig.addColumn(action.columnInfo.name, newRIghtColumn);

      return update(state, {
        skipReset: { $set: true },
        // Add column visually to the right of the column with the given id
        columns: {
          $set: [
            ...state.columns.slice(0, rightIndex + 1),
            {
              ...TableColumnsTemplate,
              dataType: newRIghtColumn.input,
              id: newRIghtColumn.accessor,
              label: newRIghtColumn.label,
              key: newRIghtColumn.key,
              accessor: newRIghtColumn.accessor,
              position: newRIghtColumn.position,
              csvCandidate: true,
            },
            ...state.columns.slice(rightIndex + 1, state.columns.length),
          ],
        },
      });
    case ActionTypes.DELETE_COLUMN:
      const deleteIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      // Update configuration on disk
      state.view.diskConfig.removeColumn(action.columnId);
      if (state.view.diskConfig.yaml.config.remove_field_when_delete_column) {
        Promise.all(
          state.data.map(async (row: RowDataType) => {
            updateRowFile(
              row.note.getFile(),
              action.key,
              undefined, // delete does not need this field
              state,
              UpdateRowOptions.REMOVE_COLUMN
            );
          })
        );
      }
      // Update state
      return update(state, {
        skipReset: { $set: true },
        columns: {
          $set: [
            ...state.columns.slice(0, deleteIndex),
            ...state.columns.slice(deleteIndex + 1, state.columns.length),
          ],
        },
      });
    /**
     * Check if the given option cell is a candidate for moving the file into a subfolder
     */
    case ActionTypes.UPDATE_OPTION_CELL:
      // check if this column is configured as a group folder
      if (dbconfig.group_folder_column === action.key) {
        moveFile(`${state.view.file.parent.path}/${action.value}`, action);
        action.row[
          MetadataColumns.FILE
        ] = `[[${state.view.file.parent.path}/${action.value}/${action.file.name}|${action.file.basename}]]`;
        action.row.original.note = new NoteInfo(
          {
            ...action.row,
            file: {
              path: `${state.view.file.parent.path}/${action.value}/${action.file.name}`,
            },
          },
          action.row.index
        );
        // Update original cell value
        const update_option_cell_index = state.columns.findIndex(
          (column) => column.id === action.columnId
        );
        const update_option_cell_column_key =
          state.columns[update_option_cell_index].key;
        return update(state, {
          data: {
            [action.row.index]: {
              $merge: {
                [MetadataColumns.FILE]: action.row[MetadataColumns.FILE],
                note: action.row.original.note,
                [update_option_cell_column_key]: action.value,
              },
            },
          },
        });
      }
    // Otherwise, update the value of the cell using the normal update method
    /**
     * Update the value of a cell in the table and save it on disk
     */
    case ActionTypes.UPDATE_CELL:
      // Obtain current column index
      const update_cell_index = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      // Save on disk
      updateRowFile(
        action.file,
        action.key,
        action.value,
        state,
        UpdateRowOptions.COLUMN_VALUE
      );
      const update_option_cell_column_key =
        state.columns[update_cell_index].key;
      return update(state, {
        data: {
          [action.row.index]: {
            $merge: {
              [update_option_cell_column_key]: action.value,
            },
          },
        },
      });
    /**
     * Enable reset
     */
    case ActionTypes.ENABLE_RESET:
      return update(state, { skipReset: { $set: false } });

    case ActionTypes.TOGGLE_INLINE_FRONTMATTER:
      // Altern between inline & frontmatter mode
      state.view.diskConfig.updateColumnProperties(action.columnId, {
        isInline: action.isInline,
      });
      const toggleInlineIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );

      return update(state, {
        columns: {
          [toggleInlineIndex]: {
            $merge: {
              isInline: action.isInline,
            },
          },
        },
      });
    default:
      LOGGER.warn(`<=> databaseReducer: unknown action ${action.type}`);
  }
  return state;
}

export function getDispatch(initialState: TableDataType) {
  const [state, dataDispatch] = useReducer(databaseReducer, initialState);

  useEffect(() => {
    dataDispatch({ type: ActionTypes.ENABLE_RESET });
  }, [state.data, state.columns]);

  return { state, dataDispatch };
}
