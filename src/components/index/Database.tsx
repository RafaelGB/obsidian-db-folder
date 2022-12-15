import React, { StrictMode } from "react";
import { Table } from "components/Table";
import { TableDataType } from "cdm/FolderModel";
import useTableStore from "components/reducers/TableReducer";
import DbErrorBoundary from "components/ErrorComponents";
export function createDatabase(tableProps: TableDataType): JSX.Element {
  return <Database {...tableProps} />;
}

export function Database(tableProps: TableDataType) {
  const tableStore = useTableStore(tableProps.view);
  return (
    /**
     * StrictMode is a tool for highlighting potential problems in an application.
     * Like Fragment, StrictMode does not render any visible UI.
     * It activates additional checks and warnings for its descendants.
     *
     * StrictMode currently helps with:
     * - Identifying components with unsafe lifecycles
     * - Warning about legacy string ref API usage
     * - Warning about deprecated findDOMNode usage
     * - Detecting unexpected side effects
     * - Detecting legacy context API
     *
     * StrictMode checks are run in development mode only; they do not impact the production build.
     *
     * Impact on performance:
     * - Components will all render twice, first with the standard lifecycle, then again with the deprecated lifecycles enabled for backwards compatibility.
     *
     * @see https://reactjs.org/docs/strict-mode.html
     */
    <StrictMode>
      {/** TRY CATCH REACT ERROR */}
      <DbErrorBoundary key={"db-error-boundary"}>
        <Table {...tableProps} tableStore={tableStore} />
      </DbErrorBoundary>
    </StrictMode>
  );
}
