import React from 'react';
import { App } from 'obsidian';
import { Table } from 'components/Table';
import { TableRows } from 'cdm/FolderModel';
import { DatabaseContext } from 'context/context';

export function createTable(rows:TableRows,app:App): JSX.Element {
    const tableProps = { // make sure all required component's inputs/Props keys&types match
        data: rows
      }
    return (
        <DatabaseContext.Provider value={app}>
            <Table
                {...tableProps}
            />
        </DatabaseContext.Provider>
    );
}