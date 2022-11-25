import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  ColumnDef,
  ColumnOrderState,
  Table,
  Header,
  HeaderGroup,
  Row,
  getSortedRowModel,
  ColumnSizingState,
  getFacetedRowModel,
  getFacetedMinMaxValues,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import { TableDataType, RowDataType, TableColumn } from "cdm/FolderModel";
import StateManager from "StateManager";
import {
  DatabaseLimits,
  MetadataColumns,
  ResizeConfiguration,
} from "helpers/Constants";
import { LOGGER } from "services/Logger";
import DefaultCell from "components/DefaultCell";
import DefaultHeader from "components/DefaultHeader";
import { c } from "helpers/StylesHelper";
import { HeaderNavBar } from "components/NavBar";
import TableHeader from "components/TableHeader";
import TableRow from "components/TableRow";
import getInitialColumnSizing from "components/behavior/InitialColumnSizeRecord";
import customSortingfns, {
  globalDatabaseFilterFn,
} from "components/reducers/TableFilterFlavours";
import dbfolderColumnSortingFn from "components/reducers/CustomSortingFn";
import { useState } from "react";
import { AddRow } from "components/AddRow";
import {
  obsidianMdLinksOnClickCallback,
  obsidianMdLinksOnMouseOverMenuCallback,
} from "components/obsidianArq/markdownLinks";
import HeaderContextMenuWrapper from "components/contextMenu/HeaderContextMenuWrapper";
import TableActions from "components/tableActions/TableActions";

const defaultColumn: Partial<ColumnDef<RowDataType>> = {
  minSize: DatabaseLimits.MIN_COLUMN_HEIGHT,
  maxSize: DatabaseLimits.MAX_COLUMN_HEIGHT,
  cell: DefaultCell,
  header: DefaultHeader,
  enableResizing: true,
};

/**
 * Table component based on react-table
 * @param tableDataType
 * @returns
 */
export function Table(tableData: TableDataType) {
  /** Main information about the table */
  const { view, tableStore } = tableData;
  const columns = tableStore.columns((state) => state.columns);
  const columnActions = tableStore.columns((state) => state.actions);
  const columnsInfo = tableStore.columns((state) => state.info);
  const rows = tableStore.data((state) => state.rows);

  LOGGER.debug(
    `=> Table. number of columns: ${columns.length}. number of rows: ${rows.length}`
  );

  const cell_size_config = tableStore.configState(
    (store) => store.ddbbConfig.cell_size
  );
  const sticky_first_column_config = tableStore.configState(
    (store) => store.ddbbConfig.sticky_first_column
  );

  const globalConfig = tableStore.configState((store) => store.global);
  const configInfo = tableStore.configState((store) => store.info);
  /** Plugin services */
  const stateManager: StateManager = tableData.stateManager;
  const filePath = stateManager.file.path;

  /** Table services */
  // Actions

  // Sorting
  const [sortBy, sortActions] = tableStore.sorting((store) => [
    store.sortBy,
    store.actions,
  ]);
  // Visibility
  const [columnVisibility, setColumnVisibility] = useState(
    columnsInfo.getVisibilityRecord()
  );
  // Filtering
  const [globalFilter, setGlobalFilter] = useState("");
  // Resizing
  const [columnSizing, setColumnSizing] = useState(
    getInitialColumnSizing(columns)
  );
  const [persistSizingTimeout, setPersistSizingTimeout] = useState(null);
  // Drag and drop
  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(
    columnsInfo.getValueOfAllColumnsAsociatedWith("id")
  );

  const reorderColumn = (
    draggedColumnId: string,
    targetColumnId: string,
    columnOrder: string[]
  ): ColumnOrderState => {
    columnOrder.splice(
      columnOrder.indexOf(targetColumnId),
      0,
      columnOrder.splice(columnOrder.indexOf(draggedColumnId), 1)[0] as string
    );
    return [...columnOrder];
  };
  // Niveling number of columns
  if (columnOrder.length !== columns.length) {
    setColumnOrder(columnsInfo.getValueOfAllColumnsAsociatedWith("id"));
  }

  const table: Table<RowDataType> = useReactTable({
    columns: columns,
    data: rows,
    columnResizeMode: ResizeConfiguration.RESIZE_MODE,
    state: {
      globalFilter: globalFilter,
      columnOrder: columnOrder,
      columnSizing: columnSizing,
      sorting: sortBy,
      columnVisibility: columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: sortActions.alterSorting,
    onColumnSizingChange: (updater) => {
      const { isResizingColumn, deltaOffset, columnSizingStart } =
        table.options.state.columnSizingInfo;
      let list: ColumnSizingState = null;
      if (typeof updater === "function") {
        list = updater(columnSizing);
      } else {
        list = updater;
      }

      const columnToUpdate = columnSizingStart.find(
        (c) => c[0] === isResizingColumn
      );

      list[columnToUpdate[0]] = columnToUpdate[1] + deltaOffset;

      // cancelling previous timeout
      if (persistSizingTimeout) {
        clearTimeout(persistSizingTimeout);
      }
      // setting new timeout
      setPersistSizingTimeout(
        setTimeout(() => {
          columnActions.alterColumnSize(
            columnToUpdate[0],
            columnToUpdate[1] + deltaOffset
          );
          // timeout until event is triggered after user has stopped typing
        }, 1500)
      );

      setColumnSizing(list);
    },
    onColumnOrderChange: setColumnOrder,
    // Hack to force react-table to use all columns when filtering
    getColumnCanGlobalFilter: () => true,
    globalFilterFn: globalDatabaseFilterFn(configInfo.getLocalSettings()),
    filterFns: customSortingfns,
    meta: {
      tableState: tableStore,
      view: view,
    },
    defaultColumn: {
      ...defaultColumn,
      sortingFn: dbfolderColumnSortingFn(configInfo.getLocalSettings()),
    },
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    debugTable: globalConfig.enable_debug_mode,
    debugHeaders: globalConfig.enable_debug_mode,
    debugColumns: globalConfig.enable_debug_mode,
    autoResetPageIndex: false,
  });

  LOGGER.debug(`<= Table`);
  return (
    <>
      <HeaderNavBar
        key={`div-header-navbar`}
        table={table}
        globalFilterRows={{
          globalFilter: globalFilter,
          setGlobalFilter: setGlobalFilter,
        }}
      />
      {/* INIT TABLE */}
      <div
        key={`div-table`}
        className={`${c(
          "table noselect cell_size_" +
            cell_size_config +
            (sticky_first_column_config ? " sticky_first_column" : "")
        )}`}
        /** Obsidian event to show page preview */
        onMouseOver={obsidianMdLinksOnMouseOverMenuCallback(view)}
        /** Obsidian to open an internal link in a new pane */
        onClick={obsidianMdLinksOnClickCallback(stateManager, view, filePath)}
        style={{
          width: table.getCenterTotalSize(),
        }}
      >
        <div
          key={`div-table-header-group-sticky`}
          className={c("table-header-group sticky-level-2")}
        >
          {/* INIT HEADERS */}
          {table
            .getHeaderGroups()
            .map(
              (
                headerGroup: HeaderGroup<RowDataType>,
                headerGroupIndex: number
              ) => {
                //headerGroup.headers.find((h) => h.id === "expander");
                const headerContext = headerGroup.headers.find(
                  (h) => h.id === MetadataColumns.ROW_CONTEXT_MENU
                );
                const addColumnHeader = headerGroup.headers.find(
                  (h) => h.id === MetadataColumns.ADD_COLUMN
                );
                return (
                  <div
                    key={`${headerGroup.id}-${headerGroupIndex}`}
                    className={`${c("tr header-group")}`}
                  >
                    {/** HEADER CONTEXT */}
                    <HeaderContextMenuWrapper
                      header={headerContext}
                      style={{
                        width: "30px",
                      }}
                    />
                    {/** LIST OF COLUMNS */}
                    {headerGroup.headers
                      .filter(
                        (h) =>
                          ![headerContext.id, addColumnHeader.id].includes(h.id)
                      )
                      .map(
                        (
                          header: Header<RowDataType, TableColumn>,
                          headerIndex: number
                        ) => (
                          <TableHeader
                            key={`${header.id}-${headerIndex}`}
                            table={table}
                            header={header}
                            reorderColumn={reorderColumn}
                            headerIndex={headerIndex + 1}
                          />
                        )
                      )}
                    {/** ADD COLUMN HEADER*/}
                    <HeaderContextMenuWrapper header={addColumnHeader} />
                  </div>
                );
              }
            )}
          {/* ENDS HEADERS */}
        </div>
        {/* INIT BODY */}
        <div
          key={`div-tbody`}
          style={{
            display: "table-row-group",
          }}
        >
          {table.getRowModel().rows.map((row: Row<RowDataType>) => (
            <TableRow key={`table-cell-${row.index}`} row={row} table={table} />
          ))}
          {/* ENDS BODY */}
        </div>
        {/* ENDS TABLE */}
      </div>

      <AddRow table={table} />

      {/* INIT DEBUG INFO */}
      {globalConfig.enable_show_state && (
        <pre>
          <code>{JSON.stringify(table.getState(), null, 2)}</code>
        </pre>
      )}
      {/* ENDS DEBUG INFO */}
      {/* INIT TABLE ACTIONS */}
      <TableActions table={table} />
    </>
  );
}
