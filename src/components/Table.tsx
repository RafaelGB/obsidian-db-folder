import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  ColumnDef,
  ColumnOrderState,
  flexRender,
  Table,
  Header,
  HeaderGroup,
  Row,
  getSortedRowModel,
  ColumnSizingState,
} from "@tanstack/react-table";
import {
  TableDataType,
  RowDataType,
  TableColumn,
  RowTemplateOption,
} from "cdm/FolderModel";
import StateManager from "StateManager";
import { getNormalizedPath } from "helpers/VaultManagement";
import {
  DatabaseCore,
  DatabaseLimits,
  MetadataColumns,
  ResizeConfiguration,
} from "helpers/Constants";
import PlusIcon from "components/img/Plus";
import { LOGGER } from "services/Logger";
import DefaultCell from "components/DefaultCell";
import DefaultHeader from "components/DefaultHeader";
import { c } from "helpers/StylesHelper";
import { HeaderNavBar } from "components/NavBar";
import TableHeader from "components/TableHeader";
import CustomTemplateSelectorStyles from "components/styles/RowTemplateStyles";
import Select, { OnChangeValue } from "react-select";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TableCell from "components/TableCell";
import getInitialColumnSizing from "components/behavior/InitialColumnSizeRecord";
import { globalDatabaseFilterFn } from "components/reducers/TableFilterFlavours";

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
  const [columns, alterColumnSize, columnsInfo] = tableStore.columns(
    (state) => [state.columns, state.alterColumnSize, state.info]
  );
  const [rows, addRow] = tableStore.data((state) => [state.rows, state.addRow]);
  LOGGER.debug(
    `=> Table. number of columns: ${columns.length}. number of rows: ${rows.length}`
  );

  const [ddbbConfig, globalConfig, configActions] = tableStore.configState(
    (store) => [store.ddbbConfig, store.global, store.actions]
  );

  /** Plugin services */
  const stateManager: StateManager = tableData.stateManager;
  const filePath = stateManager.file.path;

  /** Table services */
  // Sorting
  const [sortBy, alterSorting] = tableStore.sorting((store) => [
    store.sortBy,
    store.alterSorting,
  ]);
  // Visibility
  const [columnVisibility, setColumnVisibility] = React.useState(
    columnsInfo.getVisibilityRecord()
  );
  // Filtering
  const [globalFilter, setGlobalFilter] = React.useState("");
  // Resizing
  const [columnSizing, setColumnSizing] = React.useState(
    getInitialColumnSizing(columns)
  );
  const [persistSizingTimeout, setPersistSizingTimeout] = React.useState(null);
  // Drag and drop
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>(
    columns.map((c) => c.id)
  );
  const findColumn = React.useCallback(
    (id: string) => {
      const findedColumn = columns.find((c) => c.id === id);
      return {
        findedColumn,
        index: columns.indexOf(findedColumn),
      };
    },
    [columns]
  );
  // Niveling number of columns
  if (columnOrder.length !== columns.length) {
    setColumnOrder(columns.map((c) => c.id));
  }

  // new Row Template
  const [templateRow, templateOptions, templateUpdate] = tableStore.rowTemplate(
    (store) => [store.template, store.options, store.update]
  );
  /** Obsidian event to show page preview */
  const onMouseOver = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const targetEl = e.target as HTMLElement;
      if (targetEl.tagName !== "A" || !view) return;

      if (targetEl.hasClass("internal-link")) {
        view.app.workspace.trigger("hover-link", {
          event: e.nativeEvent,
          source: DatabaseCore.FRONTMATTER_KEY,
          hoverParent: view,
          targetEl,
          linktext: targetEl.getAttr("href"),
          sourcePath: view.file.path,
        });
      }
    },
    [view]
  );
  /** Obsidian to open an internal link in a new pane */
  const onClick = React.useCallback(
    async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.type === "auxclick" && e.button == 2) {
        return;
      }

      const targetEl = e.target as HTMLElement;
      const closestAnchor =
        targetEl.tagName === "A" ? targetEl : targetEl.closest("a");

      if (!closestAnchor) return;

      if (closestAnchor.hasClass("file-link")) {
        e.preventDefault();
        const href = closestAnchor.getAttribute("href");
        const normalizedPath = getNormalizedPath(href);
        const target =
          typeof href === "string" &&
          view.app.metadataCache.getFirstLinkpathDest(
            normalizedPath.root,
            view.file.path
          );

        if (!target) return;
        (app as any).openWithDefaultApp(target.path);

        return;
      }

      if (closestAnchor.hasClass("internal-link")) {
        e.preventDefault();
        const destination = closestAnchor.getAttr("href");
        const inNewLeaf = e.button === 1 || e.ctrlKey || e.metaKey;
        const isUnresolved = closestAnchor.hasClass("is-unresolved");

        app.workspace.openLinkText(destination, filePath, inNewLeaf);

        return;
      }
    },
    [stateManager, filePath]
  );

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
    onSortingChange: alterSorting,
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
          alterColumnSize(columnToUpdate[0], columnToUpdate[1] + deltaOffset);
          // timeout until event is triggered after user has stopped typing
        }, 1500)
      );

      setColumnSizing(list);
    },
    onColumnOrderChange: setColumnOrder,
    // Hack to force react-table to use all columns when filtering
    getColumnCanGlobalFilter: (column) => true,
    globalFilterFn: globalDatabaseFilterFn(ddbbConfig),
    meta: {
      tableState: tableStore,
      view: view,
    },
    defaultColumn: defaultColumn,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: globalConfig.enable_debug_mode,
    debugHeaders: globalConfig.enable_debug_mode,
    debugColumns: globalConfig.enable_debug_mode,
  });

  // Manage input of new row
  const [inputNewRow, setInputNewRow] = React.useState("");
  const newRowRef = React.useRef(null);
  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      handleAddNewRow();
    }
  }

  function handleAddNewRow() {
    addRow(inputNewRow, columns, ddbbConfig);
    setInputNewRow("");
    newRowRef.current.value = "";
  }

  function handleChangeRowTemplate(
    newValue: OnChangeValue<RowTemplateOption, false>
  ) {
    const settingsValue = !!newValue ? newValue.value : "";
    templateUpdate(settingsValue);
    configActions.alterConfig({
      current_row_template: settingsValue,
    });
  }
  LOGGER.debug(`<= Table`);
  return (
    <>
      <div
        key={`div-table-navbar`}
        className={`${c("table sticky-level-1 sticky_first_column")}`}
        style={{
          width: table.getCenterTotalSize(),
        }}
      >
        {/* INIT NAVBAR */}
        <HeaderNavBar
          key={`div-header-navbar`}
          table={table}
          globalFilterRows={{
            globalFilter: globalFilter,
            hits: table.getFilteredRowModel().rows.length,
            setGlobalFilter: setGlobalFilter,
          }}
        />
        {/* ENDS NAVBAR */}
      </div>
      {/* INIT TABLE */}
      <div
        key={`div-table`}
        className={`${c(
          "table noselect cell_size_" +
            ddbbConfig.cell_size +
            (ddbbConfig.sticky_first_column ? " sticky_first_column" : "")
        )}`}
        onMouseOver={onMouseOver}
        onClick={onClick}
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
              ) => (
                <div
                  key={`${headerGroup.id}-${headerGroupIndex}`}
                  className={`${c("tr header-group")}`}
                >
                  {/* TODO manage context with documentFragment in any way to fix DnD conflict with Obsidian */}
                  <DndProvider
                    key={`${headerGroup.id}-${headerGroupIndex}-dnd-provider`}
                    debugMode={globalConfig.enable_debug_mode}
                    backend={HTML5Backend}
                    context={
                      (globalConfig.enable_debug_mode,
                      globalConfig.enable_dnd
                        ? activeWindow
                        : activeDocument.createElement("div"))
                    }
                  >
                    {headerGroup.headers
                      .filter(
                        (o: Header<RowDataType, TableColumn>) =>
                          (o.column.columnDef as TableColumn).key !==
                          MetadataColumns.ADD_COLUMN
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
                            findColumn={findColumn}
                            headerIndex={headerIndex}
                          />
                        )
                      )}
                  </DndProvider>
                  {headerGroup.headers
                    .filter(
                      (o: Header<RowDataType, TableColumn>) =>
                        (o.column.columnDef as TableColumn).key ===
                        MetadataColumns.ADD_COLUMN
                    )
                    .map(
                      (
                        header: Header<RowDataType, unknown>,
                        headerIndex: number
                      ) => (
                        <div
                          key={`${header.id}-${headerIndex}`}
                          className={`${c("th")}`}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>
                      )
                    )}
                </div>
              )
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
          {table
            .getRowModel()
            .rows.map((row: Row<RowDataType>, rowIndex: number) => (
              <TableCell
                key={`table-cell-${rowIndex}`}
                row={row}
                rowIndex={rowIndex}
              />
            ))}

          {/* ENDS BODY */}
        </div>
        {/* ENDS TABLE */}
      </div>
      {/* INIT NEW ROW */}
      <div key={`div-add-row`} className={`${c("tr add-row")}`}>
        <div key={`div-add-row-cell`} className={`${c("td")}`}>
          <input
            type="text"
            ref={newRowRef}
            onChange={(e) => {
              setInputNewRow(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="filename of new row"
          />
        </div>
        <div
          key={`div-add-row-cell-button`}
          className={`${c("td")}`}
          onClick={handleAddNewRow}
        >
          <span className="svg-icon svg-gray" style={{ marginRight: 8 }}>
            <PlusIcon />
          </span>
        </div>
        <div
          key={`div-add-row-cell-padding-left`}
          className={`${c("td padding-left")}`}
        >
          <Select
            styles={CustomTemplateSelectorStyles}
            options={templateOptions}
            value={
              templateRow
                ? {
                    label: templateRow,
                    value: templateRow,
                  }
                : null
            }
            isClearable={true}
            isMulti={false}
            onChange={handleChangeRowTemplate}
            placeholder={"Without template. Select one to use..."}
            menuPortalTarget={document.body}
            menuShouldBlockScroll={true}
            isSearchable
            menuPlacement="top"
          />
        </div>
        {/* ENDS NEW ROW */}
      </div>
      {/* INIT DEBUG INFO */}
      {ddbbConfig.enable_show_state && (
        <pre>
          <code>{JSON.stringify(table.getState(), null, 2)}</code>
        </pre>
      )}
      {/* ENDS DEBUG INFO */}
    </>
  );
}
