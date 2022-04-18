import React, { useEffect, useReducer } from 'react';
import update from 'immutability-helper';
import { ActionTypes, MetadataColumns, UpdateRowOptions } from 'helpers/Constants';
import { TableColumn, TableDataType } from 'cdm/FolderModel';
import { LOGGER } from 'services/Logger';
import { ActionType } from 'react-table';
import { VaultManagerDB } from 'services/FileManagerService';
import { adapterRowToDatabaseYaml, updateRowFile } from 'helpers/VaultManagement';
import { updateColumnHeaderOnDatabase } from 'parsers/DatabaseParser';

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
                    [column.id]: ''
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
            });
        case ActionTypes.UPDATE_COLUMN_HEADER:
            const index = state.columns.findIndex(
                (column:any) => column.id === action.columnId
            );
            // Update configuration on disk
            updateColumnHeaderOnDatabase(state, action.columnId, action.label);
            state.data.forEach(async (row:any) => {
                updateRowFile(
                row[MetadataColumns.FILE],
                action.columnId,
                action.label,
                UpdateRowOptions.COLUMN_KEY);
            });
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