import React, { useEffect, useReducer } from 'react';
import { App } from 'obsidian';
import { Table } from 'components/Table';
import { TableDataType } from 'cdm/FolderModel';
import { DatabaseContext } from 'context/context';
import { databaseReducer } from 'components/reducers/DatabaseDispatch';
import { ActionTypes } from 'helpers/Constants';
  
export function createDatabase(tableProps:TableDataType,app:App): JSX.Element {
    return (
        <DatabaseContext.Provider value={app}>
            <Database
                {...tableProps}
            />
        </DatabaseContext.Provider>
    );
}

function Database(tableProps:TableDataType){
  const [state, dataDispatch] = useReducer(databaseReducer, tableProps);

  useEffect(() => {
    dataDispatch({ type: ActionTypes.ENABLE_RESET });
  }, [state.data, state.columns]);
  return(
    <div>
      <Table
        {...state}
        dispatch={dataDispatch}
      />
    </div>
  );
}