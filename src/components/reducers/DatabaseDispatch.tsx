import React, { useEffect, useReducer } from 'react';
import update from 'immutability-helper';
import { ActionTypes } from 'helpers/Constants';
import { TableDataType } from 'cdm/FolderModel';
import { LOGGER } from 'services/Logger';
import { ActionType } from 'react-table';

function databaseReducer(state:any, action:ActionType) {
    switch (action.type) {
        /**
         * Add new row into table
         */
        case ActionTypes.ADD_ROW:
            LOGGER.debug('Add new row into table');
            return update(state, {
            skipReset: { $set: true },
            data: { $push: [{}] },
            });
        /**
         * Enable reset
         */
        case ActionTypes.ENABLE_RESET:
            return update(state, { skipReset: { $set: true } });
        default:
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