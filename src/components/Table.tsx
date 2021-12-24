import React from 'react';
import Card from "@material-ui/core/Card";
import SortIcon from "@material-ui/icons/ArrowDownward";
import DataTable from "react-data-table-component";
import ReactDOM from 'react-dom';

let sample = [
    {
        id: 1,
        title: "Beetlejuice",
        year: "1988",
        runtime: "92",
        genres: ["Comedy", "Fantasy"],
        director: "Tim Burton",
        actors: "Alec Baldwin, Geena Davis, Annie McEnroe, Maurice Page",
        plot:
          'A couple of recently deceased ghosts contract the services of a "bio-exorcist" in order to remove the obnoxious new owners of their house.',
        posterUrl:
          "https://images-na.ssl-images-amazon.com/images/M/MV5BMTUwODE3MDE0MV5BMl5BanBnXkFtZTgwNTk1MjI4MzE@._V1_SX300.jpg"
      }
];

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

export function ReactSample() {
    return (
        <div className="ReactSample">
        <Card>
          <DataTable
            title="Movies"
            columns={columns}
            data={sample}
            defaultSortFieldId={1}
            sortIcon={<SortIcon />}
            pagination
            selectableRows
          />
        </Card>
      </div>
    );
  }

  const rootElement = document.getElementById("table-container");
  ReactDOM.render(<ReactSample />, rootElement);