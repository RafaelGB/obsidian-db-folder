import React, { useEffect, useReducer } from 'react';
import update from 'immutability-helper';
import { ActionTypes, DataTypes, MetadataColumns, UpdateRowOptions } from 'helpers/Constants';
import { TableColumn, TableDataType } from 'cdm/FolderModel';
import { LOGGER } from 'services/Logger';
import { ActionType } from 'react-table';
import { VaultManagerDB } from 'services/FileManagerService';
import { adapterRowToDatabaseYaml, updateRowFile } from 'helpers/VaultManagement';
import { randomColor } from 'helpers/Colors';

export function databaseReducer(state:TableDataType, action:ActionType) {
    LOGGER.debug(`<=>databaseReducer action: ${action.type}`);
    // Check if action exists
    if (!action){ return state; }
    switch (action.type) {
        /**
         * Add option to column
         */
        case ActionTypes.ADD_OPTION_TO_COLUMN:
            const optionIndex = state.columns.findIndex(
                (column:TableColumn) => column.id === action.columnId
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
          let row = {};
          state.columns
          .filter((column:TableColumn)=>!column.isMetadata)
          .forEach((column:TableColumn) => {
            row = {
                ...row,
                [column.key]: ''
              };
          });
          // Add note to persist row
          VaultManagerDB.create_markdown_file(
            state.view.file.parent, 
            action.payload,
            adapterRowToDatabaseYaml(row)
          );
          const filename = `${state.view.file.parent.path}/${action.payload}.md`;
          row = {
              ...row,
              [MetadataColumns.FILE]: `[[${filename}]]`
            };
            // TODO add typing
          return update(state as any, {
            data: { $push: [row] },
          }
        );
        /**
         * Modify column label of its header.
         * Update key of column in all rows
         */
        case ActionTypes.UPDATE_COLUMN_LABEL:
          const index = state.columns.findIndex(
              (column:any) => column.id === action.columnId
          );
          // Adapt label to be a valid yaml key
          const key = action.label.trim();
          // Update configuration on disk
          state.diskConfig.updateColumnProperties(
            action.columnId,
            {label: action.label, accessor: key, key: key}
          );
          Promise.all(state.data.map(async (row:any) => {
              updateRowFile(
              row[MetadataColumns.FILE],
              action.accessor,
              key,
              UpdateRowOptions.COLUMN_KEY);
          }));
          // Update state
          return {
              ...state,
              skipReset: true,
              columns: [
              ...state.columns.slice(0, index),
              { ...state.columns[index], label: action.label },
              ...state.columns.slice(index + 1, state.columns.length)
              ]
          };
        
          /**
           * Modify type of column and adapt the data.
           * Update type on disk
           */
        case ActionTypes.UPDATE_COLUMN_TYPE:
            const typeIndex = state.columns.findIndex(
                column => column.id === action.columnId
            );
            // Update configuration on disk
            state.diskConfig.updateColumnProperties(action.columnId, {input: action.dataType});
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
                        ...state.columns.slice(typeIndex + 1, state.columns.length)
                      ],
                      data: state.data.map((row:any) => ({
                        ...row,
                        [action.columnId]: isNaN(row[action.columnId])
                          ? ""
                          : Number.parseInt(row[action.columnId])
                      }))
                    };
                  }
                case DataTypes.SELECT:
                  if (state.columns[typeIndex].dataType === DataTypes.SELECT) {
                    return {
                      ...state,
                      columns: [
                        ...state.columns.slice(0, typeIndex),
                        { ...state.columns[typeIndex], dataType: action.dataType },
                        ...state.columns.slice(typeIndex + 1, state.columns.length)
                      ],
                      skipReset: true
                    };
                  } else {
                    const options:any = [];
                    state.data.forEach((row) => {
                      if (row[action.columnId]) {
                        options.push({
                          label: row[action.columnId],
                          backgroundColor: randomColor()
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
                          options: [...state.columns[typeIndex].options, ...options]
                        },
                        ...state.columns.slice(typeIndex + 1, state.columns.length)
                      ],
                      skipReset: true
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
                        ...state.columns.slice(typeIndex + 1, state.columns.length)
                      ]
                    };
                  } else {
                    return {
                      ...state,
                      skipReset: true,
                      columns: [
                        ...state.columns.slice(0, typeIndex),
                        { ...state.columns[typeIndex], dataType: action.dataType },
                        ...state.columns.slice(typeIndex + 1, state.columns.length)
                      ],
                      data: state.data.map((row) => ({
                        ...row,
                        [action.columnId]: row[action.columnId] + ""
                      }))
                    };
                  }
                default:
                  return state;
              }
        case ActionTypes.UPDATE_CELL:
            LOGGER.warn(`Method declarated but not implemented yet: ${action.type}`);
            break;
        case ActionTypes.ADD_COLUMN_TO_LEFT:
            LOGGER.warn(`Method declarated but not implemented yet: ${action.type}`);
            break;
        case ActionTypes.ADD_COLUMN_TO_RIGHT:
            LOGGER.warn(`Method declarated but not implemented yet: ${action.type}`);
            break;
        case ActionTypes.DELETE_COLUMN:
            LOGGER.warn(`Method declarated but not implemented yet: ${action.type}`);
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

export function getDispatch(initialState:TableDataType) {
    const [state, dataDispatch] = useReducer(databaseReducer, initialState);
    
    useEffect(() => {
        dataDispatch({ type: ActionTypes.ENABLE_RESET });
    }, [state.data, state.columns]);

    return {state, dataDispatch};
}