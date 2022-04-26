import React, { useEffect, useReducer } from "react";
import update from "immutability-helper";
import {
  ActionTypes,
  DataTypes,
  MetadataColumns,
  UpdateRowOptions,
} from "helpers/Constants";
import { TableColumn, TableDataType, TableRow } from "cdm/FolderModel";
import { LOGGER } from "services/Logger";
import { ActionType } from "react-table";
import { VaultManagerDB } from "services/FileManagerService";
import {
  adapterRowToDatabaseYaml,
  updateRowFile,
} from "helpers/VaultManagement";
import { randomColor } from "helpers/Colors";
import { DatabaseColumn } from "cdm/DatabaseModel";
import NoteInfo from "services/NoteInfo";
import { dbTrim } from "helpers/StylesHelper";

export function databaseReducer(state: TableDataType, action: ActionType) {
  LOGGER.debug(
    `<=>databaseReducer action: ${action.type} value: ${action.value}`
  );
  console.log(action.type);
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
      const rowRecord: Record<string, any> = {};
      state.columns
        .filter((column: TableColumn) => !column.isMetadata)
        .forEach((column: TableColumn) => {
          rowRecord[column.key] = "";
        });
      // Add note to persist row
      VaultManagerDB.create_markdown_file(
        state.view.file.parent,
        action.filename,
        adapterRowToDatabaseYaml(rowRecord)
      );

      const row: TableRow = {
        ...rowRecord,
        id: state.data.length + 1,
        note: new NoteInfo(
          { ...rowRecord, file: { path: filename } },
          state.data.length + 1
        ),
        [MetadataColumns.FILE]: `[[${filename}]]`,
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
      const index = state.columns.findIndex(
        (column: any) => column.id === action.columnId
      );
      // trim label will get a valid yaml key
      const update_col_key: string = dbTrim(action.label);
      // Update configuration & row files on disk
      state.view.diskConfig.updateColumnProperties(
        action.columnId,
        { label: action.label, accessor: update_col_key, key: update_col_key },
        state.data // Update all rows with new key
      );
      // Update state
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, index),
          {
            ...state.columns[index],
            label: action.label,
            id: update_col_key,
            key: update_col_key,
            accessor: update_col_key,
          },
          ...state.columns.slice(index + 1, state.columns.length),
        ],
      };

    /**
     * Modify type of column and adapt the data.
     * Update type on disk
     */
    case ActionTypes.UPDATE_COLUMN_TYPE:
      const typeIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      // Update configuration on disk
      state.view.diskConfig.updateColumnProperties(action.columnId, {
        input: action.dataType,
      });
      // Update state
      switch (action.dataType) {
        case DataTypes.NUMBER:
          if (state.columns[typeIndex].dataType === DataTypes.NUMBER) {
            return state;
          } else {
            return {
              ...state,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
              data: state.data.map((row: any) => ({
                ...row,
                [action.columnId]: isNaN(row[action.columnId])
                  ? ""
                  : Number.parseInt(row[action.columnId]),
              })),
            };
          }
        case DataTypes.SELECT:
          if (state.columns[typeIndex].dataType === DataTypes.SELECT) {
            return {
              ...state,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
              skipReset: true,
            };
          } else {
            const options: any = [];
            state.data.forEach((row) => {
              if (row[action.columnId]) {
                options.push({
                  label: row[action.columnId],
                  backgroundColor: randomColor(),
                });
              }
            });
            return {
              ...state,
              columns: [
                ...state.columns.slice(0, typeIndex),
                {
                  ...state.columns[typeIndex],
                  dataType: action.dataType,
                  options: [...state.columns[typeIndex].options, ...options],
                },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
              skipReset: true,
            };
          }
        case DataTypes.TEXT:
          if (state.columns[typeIndex].dataType === DataTypes.TEXT) {
            return state;
          } else if (state.columns[typeIndex].dataType === DataTypes.SELECT) {
            return {
              ...state,
              skipReset: true,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
            };
          } else {
            return {
              ...state,
              skipReset: true,
              columns: [
                ...state.columns.slice(0, typeIndex),
                { ...state.columns[typeIndex], dataType: action.dataType },
                ...state.columns.slice(typeIndex + 1, state.columns.length),
              ],
              data: state.data.map((row) => ({
                ...row,
                [action.columnId]: row[action.columnId] + "",
              })),
            };
          }
        default:
          return state;
      }
    /**
     * Add new column to the table to the left of the column with the given id
     * and save it on disk
     */
    case ActionTypes.ADD_COLUMN_TO_LEFT:
      const leftIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      const leftId = state.columns.length + 1 - state.metadataColumns.length;

      const newLeftColumn: DatabaseColumn = {
        input: DataTypes.TEXT,
        accessor: `newColumn${leftId}`,
        key: `newColumn${leftId}`,
        label: `new Column ${leftId}`,
        position: leftId,
      };
      // Update configuration on disk
      state.view.diskConfig.addColumn(`newColumn${leftId}`, newLeftColumn);

      Promise.all(
        state.data.map(async (row: TableRow) => {
          updateRowFile(
            row.note.getFile(),
            newLeftColumn.key,
            "",
            UpdateRowOptions.ADD_COLUMN
          );
        })
      );
      // Update state
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, leftIndex),
          {
            id: newLeftColumn.accessor,
            label: newLeftColumn.label,
            key: newLeftColumn.key,
            accessor: newLeftColumn.accessor,
            dataType: DataTypes.TEXT,
            created: action.focus && true,
            options: [],
          },
          ...state.columns.slice(leftIndex, state.columns.length),
        ],
      };
    /**
     * Add new column to the table to the right of the column with the given id
     * and save it on disk
     */
    case ActionTypes.ADD_COLUMN_TO_RIGHT:
      const rightIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      const rightId = `${
        state.columns.length + 1 - state.metadataColumns.length
      }`;

      const newRIghtColumn: DatabaseColumn = {
        input: DataTypes.TEXT,
        accessor: rightId,
        key: `newColumn${rightId}`,
        label: `new Column ${rightId}`,
      };
      // Update configuration on disk
      state.view.diskConfig.addColumn(rightId, newRIghtColumn);

      Promise.all(
        state.data.map(async (row: TableRow) => {
          updateRowFile(
            row.note.getFile(),
            newRIghtColumn.key,
            "",
            UpdateRowOptions.ADD_COLUMN
          );
        })
      );
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, rightIndex + 1),
          {
            id: newRIghtColumn.accessor,
            label: newRIghtColumn.label,
            key: newRIghtColumn.key,
            accessor: newRIghtColumn.accessor,
            dataType: DataTypes.TEXT,
            created: action.focus && true,
            options: [],
          },
          ...state.columns.slice(rightIndex + 1, state.columns.length),
        ],
      };
    case ActionTypes.DELETE_COLUMN:
      const deleteIndex = state.columns.findIndex(
        (column) => column.id === action.columnId
      );
      // Update configuration on disk
      state.view.diskConfig.removeColumn(action.columnId);
      Promise.all(
        state.data.map(async (row: TableRow) => {
          updateRowFile(
            row.note.getFile(),
            action.key,
            undefined, // delete does not need this field
            UpdateRowOptions.REMOVE_COLUMN
          );
        })
      );
      // Update state
      return {
        ...state,
        skipReset: true,
        columns: [
          ...state.columns.slice(0, deleteIndex),
          ...state.columns.slice(deleteIndex + 1, state.columns.length),
        ],
      };
    case ActionTypes.UPDATE_CELL:
      console.log("something changed");
      // save on disk
      updateRowFile(
        action.note,
        action.key,
        action.value,
        UpdateRowOptions.COLUMN_VALUE
      );
      break;
    /**
     * Enable reset
     */
    case ActionTypes.ENABLE_RESET:
      return update(state, { skipReset: { $set: false } });
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
