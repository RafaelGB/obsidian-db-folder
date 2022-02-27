import React from 'react';
import { Table } from 'components/Table';
import { TableRows } from 'cdm/FolderModel';

export function createTable(rows:TableRows): JSX.Element {
    const tableProps = { // make sure all required component's inputs/Props keys&types match
        data: rows
      }
    return (
        <Table
            {...tableProps}
        />
    );
}