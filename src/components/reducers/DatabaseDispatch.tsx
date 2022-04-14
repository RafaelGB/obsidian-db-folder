import React, { useEffect, useReducer } from 'react';
import update from 'immutability-helper';
import { ActionTypes, MetadataColumns } from 'helpers/Constants';
import { DatabaseColumn, TableColumn, TableDataType } from 'cdm/FolderModel';
import { LOGGER } from 'services/Logger';
import { ActionType } from 'react-table';
import { FileManagerDB } from 'services/FileManagerService';
import { adapterRowToDatabaseYaml } from 'helpers/VaultManagement';

export function databaseReducer(state:any, action:ActionType) {
    LOGGER.debug(`<=>databaseReducer: ${action.type}`);
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
            state.columns.forEach((column:TableColumn) => {
                row = {
                    ...row,
                    [column.id]: ''
                 };
            });
            const filename = `${action.payload}`;
            // Add note to persist row
            FileManagerDB.create_markdown_file(
                state.databaseFolder, 
                filename,
                adapterRowToDatabaseYaml(row)
            );
            row = {
                ...row,
                [MetadataColumns.FILE]: `[[${filename}]]`
             };
            return update(state, {
            data: { $push: [row] },
            });
        /**
         * Enable reset
         */
        case ActionTypes.ENABLE_RESET:
            return update(state, { skipReset: { $set: true } });
        default:
            LOGGER.warn(`<=databaseReducer: unknown action ${action.type}`);
            return state;
    }
}

export function getDispatch(initialState:TableDataType) {
    const [state, dataDispatch] = useReducer(databaseReducer, initialState);
    
    useEffect(() => {
        dataDispatch({ type: ActionTypes.ENABLE_RESET });
    }, [state.data, state.columns]);

    return {state, dataDispatch};
}