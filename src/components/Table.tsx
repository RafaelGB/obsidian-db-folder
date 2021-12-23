import React from 'react';
import ReactDOM from 'react-dom';
import DataTable from "react-data-table-component";

let sample = [
    {
        title: "Beetlejuice",
        runtime: "92",
        director: "Tim Burton",
    }
]

const columns = [
    {
      name: "Title",
      selector: "title",
      sortable: true
    },
    {
      name: "Directior",
      selector: "director",
      sortable: true
    },
    {
      name: "Runtime (m)",
      selector: "runtime",
      sortable: true,
      right: true
    }
  ];

export function ReactSample() {
    return (
      <div className="App">
          <DataTable
            title="Movies"
            columns={columns}
            data={sample}
            defaultSortField="title"
            pagination
            selectableRows
          />
      </div>
    );
  }