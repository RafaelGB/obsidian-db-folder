import Button from "@mui/material/Button";
import { PaginationProps } from "cdm/MenuBarModel";
import React, { useEffect } from "react";
import { PaginationButtonStyle } from "components/styles/NavBarStyles";
function PaginationTable(props: PaginationProps) {
  const { table } = props;
  // UseSelector to get the current page number
  const paginationSize = table.options.meta.tableState.configState(
    (state) => state.ddbbConfig.pagination_size
  );

  useEffect(() => {
    table.setPageSize(paginationSize);
  }, [paginationSize]);

  const handleChangePage = (newPage: unknown) => {
    const aux = newPage ? Number(newPage) : 0;
    const pageNumber = Math.max(Math.min(aux, table.getPageCount()), 1);
    if (typeof pageNumber === "number") {
      table.setPageIndex(pageNumber - 1);
    } else {
      table.setPageIndex(0);
    }
  };
  return (
    <>
      <Button
        size="small"
        key={`Button-Pagination-Initial`}
        sx={PaginationButtonStyle}
        onClick={() => {
          table.setPageIndex(0);
        }}
        disabled={!table.getCanPreviousPage()}
      >
        {"<<"}
      </Button>
      <Button
        size="small"
        key={`Button-Pagination-Previous`}
        sx={PaginationButtonStyle}
        onClick={() => {
          table.previousPage();
        }}
        disabled={!table.getCanPreviousPage()}
      >
        {"<"}
      </Button>
      <input
        key={`Input-Pagination-number`}
        type="text"
        value={`${
          table.getState().pagination.pageIndex + 1
        }/${table.getPageCount()}`}
        style={{
          width: "50px",
          textAlign: "center",
        }}
        onFocus={(e) =>
          (e.target.value = `${table.getState().pagination.pageIndex + 1}`)
        }
        onBlur={(e) => {
          handleChangePage(e.target.value.split("/")[0]);
        }}
        onKeyDown={(e) => {
          switch (e.key) {
            case "Enter":
              e.currentTarget.blur();
              break;
            case "ArrowUp":
              handleChangePage(table.getState().pagination.pageIndex + 1);

              break;
            case "ArrowDown":
              handleChangePage(table.getState().pagination.pageIndex - 1);
              break;
            case "Escape":
              e.currentTarget.blur();
            default:
            // Do nothing
          }
        }}
        onChange={(e) => {
          handleChangePage(e.target.value.split("/")[0]);
        }}
      />

      <Button
        size="small"
        key={`Button-Pagination-Next`}
        sx={PaginationButtonStyle}
        onClick={() => {
          table.nextPage();
        }}
        disabled={!table.getCanNextPage()}
      >
        {">"}
      </Button>
      <Button
        size="small"
        key={`Button-Pagination-Last`}
        sx={PaginationButtonStyle}
        onClick={() => {
          table.setPageIndex(table.getPageCount() - 1);
        }}
        disabled={!table.getCanNextPage()}
      >
        {">>"}
      </Button>
    </>
  );
}

export default PaginationTable;
