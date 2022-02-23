import React from 'react';
import Card from "@material-ui/core/Card";
import SortIcon from "@material-ui/icons/ArrowDownward";
import DataTable from "react-data-table-component";

const columns = [
    {
      id: 1,
      name: "Title",
      selector: (row: any) => row.title,
      sortable: true,
      reorder: true
    }
];

function DBFolderList(props: any) {
    const tableProps = { // make sure all required component's inputs/Props keys&types match
      data: props.input,
      title: "Files",
      columns : columns,
      defaultSortFieldId: 1,
      sortIcon: <SortIcon />,
      pagination: true,
      selectableRows: true
    }
    return (
        <div className="DBFolderList">
        <Card>
          <DataTable
            {...tableProps}
          />
        </Card>
      </div>
    );
  }

  export function createTable(divToRender: HTMLDivElement, myInput: any[]): JSX.Element {
    return <DBFolderList input={myInput} />;
  }