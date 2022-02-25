import * as React from "react";
import { useTable } from "react-table";

type Data = {
  actor: string;
  movie: string;
};

const borderStyle = {
  border: "1px solid gray",
  padding: "8px 10px"
};

function useInstance(instance:any) {
  const { allColumns } = instance;

  let rowSpanHeaders:any = [];

  allColumns.forEach((column:any, i:any) => {
    const { id, enableRowSpan } = column;

    if (enableRowSpan !== undefined) {
      rowSpanHeaders = [
        ...rowSpanHeaders,
        { id, topCellValue: null, topCellIndex: 0 }
      ];
    }
  });

  Object.assign(instance, { rowSpanHeaders });
}

export function App() {
  const origData = [
    {
      actor: "Johnny Depp",
      movies: [
        {
          name: "Pirates of the Carribean 1"
        },
        {
          name: "Pirates of the Carribean 2"
        },
        {
          name: "Pirates of the Carribean 3"
        },
        {
          name: "Pirates of the Carribean 4"
        }
      ]
    }
  ];
  const newData: Array<Data> = [];
  origData.forEach(actorObj => {
    actorObj.movies.forEach(movie => {
      newData.push({
        actor: actorObj.actor,
        movie: movie.name
      });
    });
  });
  const data = React.useMemo(() => newData, []);
  const columns = React.useMemo(
    () => [
      {
        Header: "Actor",
        accessor: "actor",
        enableRowSpan: true
      },
      {
        Header: "Movies",
        accessor: "movie"
      }
    ],
    []
  );
  let propsUseTable:any = {columns, data};
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(propsUseTable, hooks => {
    hooks.useInstance.push(useInstance);
  });
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} style={borderStyle}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return null;
        })}
        {rows.map(row => {
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell:any) => {
                if (cell.isRowSpanned) return null;
                else
                  return (
                    <td
                      style={borderStyle}
                      rowSpan={cell.rowSpan}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
