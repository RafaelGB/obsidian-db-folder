import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import { PaginationProps } from "cdm/MenuBarModel";
import React from "react";
import { PaginationButtonStyle } from "components/styles/NavBarSearchStyles";
function PaginationTable(props: PaginationProps) {
  const { table } = props;
  const [page, setPage] = React.useState(null);
  return (
    <>
      <ButtonGroup
        variant="contained"
        size="small"
        key={`ButtonGroup-PaginationTable`}
      >
        <Button
          size="small"
          key={`Button-Pagination-Initial`}
          sx={PaginationButtonStyle}
          onClick={() => {
            table.setPageIndex(0);
            setPage("");
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
            setPage(table.getState().pagination.pageIndex);
          }}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <TextField
          id="Input-Pagination-number-id"
          size="small"
          key={`Input-Pagination-number`}
          label={`Page of ${table.getPageCount()}`}
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          style={{ width: "100px" }}
          InputProps={{
            inputProps: {
              style: { textAlign: "center" },
            },
          }}
          value={page}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
            setPage(e.target.value ? Number(e.target.value) : null);
          }}
        />
        <Button
          size="small"
          key={`Button-Pagination-Next`}
          sx={PaginationButtonStyle}
          onClick={() => {
            table.nextPage();
            setPage(table.getState().pagination.pageIndex + 2);
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
            setPage(table.getPageCount());
          }}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </Button>
        {/*
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
      </ButtonGroup>
      {/* <div>{table.getRowModel().rows.length} Rows</div> */}
    </>
  );
}

export default PaginationTable;
