import React, { Component }  from 'react';
import ReactDOM from 'react-dom';
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
    },
    {
      id: 2,
      name: "Director",
      selector: (row: any) => row.director,
      sortable: true,
      reorder: true
    },
    {
      id: 3,
      name: "Runtime (m)",
      selector: (row: any) => row.runtime,
      sortable: true,
      right: true,
      reorder: true
    }
];

function ReactSample(input: any) {
    return (
        <div className="ReactSample">
        <Card>
          <DataTable
            title="Movies"
            columns={columns}
            data={input}
            defaultSortFieldId={1}
            sortIcon={<SortIcon />}
            pagination
            selectableRows
          />
        </Card>
      </div>
    );
  }

  export function createTable(divToRender: HTMLDivElement, myInput: any) {
    ReactDOM.render(<ReactSample input={myInput} />, divToRender);
  }