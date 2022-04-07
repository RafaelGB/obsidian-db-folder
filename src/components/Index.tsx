import React from 'react';
import { App } from 'obsidian';
import { Table } from 'components/Table';
import { TableDataType } from 'cdm/FolderModel';
import { DatabaseContext } from 'context/context';

export function createTable(tableProps:TableDataType,app:App): JSX.Element {

    return (
        <DatabaseContext.Provider value={app}>
            <Table
                {...tableProps}
            />
        </DatabaseContext.Provider>
    );
}