import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import { PaginationProps } from "cdm/MenuBarModel";
import React, { useEffect } from "react";
import { PaginationButtonStyle } from "components/styles/NavBarStyles";
import { StyleVariables } from "helpers/Constants";
import Grid from "@mui/material/Grid";
function PaginationTable(props: PaginationProps) {
  const { table } = props;
  const [page, setPage] = React.useState(1);

  // UseSelector to get the current page number
  const paginationSize = table.options.meta.tableState.configState(
    (state) => state.ddbbConfig.pagination_size
  );

  useEffect(() => {
    table.setPageSize(paginationSize);
  }, [paginationSize]);

  return (
    <>
      <ButtonGroup
        variant="contained"
        key={`ButtonGroup-PaginationTable`}
        fullWidth={false}
      >
        <Button
          size="small"
          key={`Button-Pagination-Initial`}
          sx={PaginationButtonStyle}
          onClick={() => {
            table.setPageIndex(0);
            setPage(1);
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
          label={`Pages: ${table.getPageCount()}`}
          type="number"
          InputLabelProps={{
            shrink: true,
            style: { color: StyleVariables.TEXT_NORMAL },
          }}
          InputProps={{
            inputProps: {
              style: { textAlign: "center" },
            },
            style: { color: StyleVariables.TEXT_NORMAL, width: 120 },
          }}
          value={page}
          onChange={(e) => {
            // Take min between max number of pages and the value of the input

            const page = e.target.value ? Number(e.target.value) : 0;
            const pageNumber = Math.min(page, table.getPageCount());
            table.setPageIndex(pageNumber - 1);
            setPage(pageNumber);
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
      </ButtonGroup>
    </>
  );
}

export default PaginationTable;
