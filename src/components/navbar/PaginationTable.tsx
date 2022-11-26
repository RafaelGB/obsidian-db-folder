import { PaginationProps } from "cdm/MenuBarModel";
import React, { useEffect } from "react";
import { c } from "helpers/StylesHelper";
import {
  drawPaginationBehavior,
  getVisiblePages,
} from "components/behavior/PaginationHelper";

function PaginationTable(props: PaginationProps) {
  const { table } = props;
  // UseSelector to get the current page number
  const paginationSize = table.options.meta.tableState.configState(
    (state) => state.ddbbConfig.pagination_size
  );

  useEffect(() => {
    table.setPageSize(paginationSize);
  }, [paginationSize]);

  const handleChangePage = (newPage: number) => {
    table.setPageIndex(newPage - 1);
  };

  return (
    <>
      {getVisiblePages(
        table.getState().pagination.pageIndex + 1,
        table.getPageCount()
      ).map((pageButton) => {
        return (
          <button
            type="button"
            key={`Button-Pagination-${pageButton.page}`}
            onClick={() => {
              handleChangePage(pageButton.page);
            }}
            disabled={
              table.getState().pagination.pageIndex + 1 === pageButton.page
            }
            className={c("pagination-button")}
          >
            {drawPaginationBehavior(pageButton)}
          </button>
        );
      })}
    </>
  );
}

export default PaginationTable;
