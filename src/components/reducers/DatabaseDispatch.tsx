import React, { useEffect, useReducer } from "react";
import update from "immutability-helper";
import {
  ActionTypes,
  InputType,
  MetadataColumns,
  UpdateRowOptions,
} from "helpers/Constants";
import { TableColumn, TableDataType, RowDataType } from "cdm/FolderModel";
import { LOGGER } from "services/Logger";
import { moveFile, updateRowFileProxy } from "helpers/VaultManagement";
import { randomColor } from "helpers/Colors";
import { OptionSelect } from "cdm/DatabaseModel";
import NoteInfo from "services/NoteInfo";
import { DataviewService } from "services/DataviewService";
import { obtainUniqueOptionValues } from "helpers/SelectHelper";

export function databaseReducer(state: TableDataType, action: any) {
  LOGGER.debug(`<=>databaseReducer action: ${action.type}`, action);
  /** database configuration */
  const dbconfig = state.view.diskConfig.yaml.config;
  // Check if action exists
  if (!action) {
    return state;
  }
  switch (action.type) {
    /**
     * Modify column label of its header.
     * Update key of column in all rows
     */
    case ActionTypes.UPDATE_COLUMN_LABEL:
      const update_column_label_index = state.view.columns.findIndex(
        (column: any) => column.id === action.columnId
      );

      // Update configuration & row files on disk
      state.view.diskConfig.updateColumnKey(
        action.columnId,
        action.newKey,
        action.label
      );
      // Promise.all(
      //   state.view.rows.map(async (row: RowDataType) => {
      //     await updateRowFileProxy(
      //       row.__note__.getFile(),
      //       action.columnId,
      //       action.newKey,
      //       action.state,
      //       UpdateRowOptions.COLUMN_KEY
      //     );
      //   })
      // );
      return update(state, {
        skipReset: { $set: true },
        // Modify column visually with the new label
        view: {
          columns: {
            $set: [
              ...state.view.columns.slice(0, update_column_label_index),
              {
                ...state.view.columns[update_column_label_index],
                label: action.label,
                id: action.newKey,
                key: action.newKey,
                accessorKey: action.newKey,
              },
              ...state.view.columns.slice(
                update_column_label_index + 1,
                state.view.columns.length
              ),
            ],
          },
          // Modify data visually with the new key
          rows: {
            $set: state.view.rows.map((row: RowDataType) => {
              row[action.newKey] = row[action.columnId];
              delete row[action.columnId];
              return row;
            }),
          },
          // Update view yaml state
          diskConfig: {
            yaml: {
              $set: state.view.diskConfig.yaml,
            },
          },
        },
      });

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

export function getDispatch(tableData: TableDataType) {
  const [state, dataDispatch] = useReducer(databaseReducer, tableData);

  useEffect(() => {
    dataDispatch({ type: ActionTypes.ENABLE_RESET });
  }, [state.view.rows, state.view.columns]);

  return { state, dataDispatch };
}
