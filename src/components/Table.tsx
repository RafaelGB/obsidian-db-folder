import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getExpandedRowModel,
  ColumnDef,
  ColumnResizeMode,
  ColumnOrderState,
  flexRender,
  Table,
  Header,
  HeaderGroup,
  Row,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import {
  TableDataType,
  RowDataType,
  TableColumn,
  RowTemplateOption,
} from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import StateManager from "StateManager";
import { getNormalizedPath } from "helpers/VaultManagement";
import {
  ActionTypes,
  DatabaseCore,
  DatabaseLimits,
  MetadataColumns,
} from "helpers/Constants";
import PlusIcon from "components/img/Plus";
import { LOGGER } from "services/Logger";
import DefaultCell from "components/DefaultCell";
import DefaultHeader from "components/DefaultHeader";
import { c } from "helpers/StylesHelper";
import { HeaderNavBar } from "components/NavBar";
import fuzzyFilter from "components/filters/GlobalFilterFn";
import TableHeader from "components/TableHeader";
import CustomTemplateSelectorStyles from "components/styles/RowTemplateStyles";
import Select, { ActionMeta, OnChangeValue } from "react-select";
import { get_tfiles_from_folder } from "helpers/FileManagement";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TableCell from "components/TableCell";
import getInitialColumnSizing from "components/behavior/InitialColumnSizeRecord";

const defaultColumn: Partial<ColumnDef<RowDataType>> = {
  minSize: DatabaseLimits.MIN_COLUMN_HEIGHT,
  maxSize: DatabaseLimits.MAX_COLUMN_HEIGHT,
  cell: DefaultCell,
  header: DefaultHeader,
};

/**
 * Table component based on react-table
 * @param tableDataType
 * @returns
 */
export function Table(tableData: TableDataType) {
  LOGGER.debug(
    `=> Table. number of columns: ${tableData.columns.length}. number of rows: ${tableData.view.rows.length}`
  );
  /** Main information about the table */
  const data = tableData.view.rows;
  const columns = tableData.columns;

  /** Reducer */
  const dataDispatch = tableData.dispatch;
  /** Plugin services */
  const view: DatabaseView = tableData.view;
  const stateManager: StateManager = tableData.stateManager;
  const filePath = stateManager.file.path;
  /** Table services */
  // Resize
  const [columnResizeMode, setColumnResizeMode] =
    React.useState<ColumnResizeMode>("onChange");

  // Sorting
  const [sorting, setSorting] = React.useState<SortingState>(
    tableData.initialState.sortBy
  );

  // Filtering
  const [globalFilter, setGlobalFilter] = React.useState("");
  const columnSizing = getInitialColumnSizing(columns);

  // Drag and drop
  const findColumn = React.useCallback(
    (id: string) => {
      const findedColumn = columns.filter((c) => `${c.id}` === id)[0];
      return {
        findedColumn,
        index: columns.indexOf(findedColumn),
      };
    },
    [columns]
  );
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);

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

        (stateManager.app as any).openWithDefaultApp(target.path);

        return;
      }

      if (closestAnchor.hasClass("internal-link")) {
        e.preventDefault();
        const destination = closestAnchor.getAttr("href");
        const inNewLeaf = e.button === 1 || e.ctrlKey || e.metaKey;
        const isUnresolved = closestAnchor.hasClass("is-unresolved");

        stateManager.app.workspace.openLinkText(
          destination,
          filePath,
          inNewLeaf
        );

        return;
      }
    },
    [stateManager, filePath]
  );

  const table: Table<RowDataType> = useReactTable({
    data,
    columns,
    columnResizeMode,
    state: {
      globalFilter: globalFilter,
      columnOrder: columnOrder,
      columnSizing: columnSizing,
      sorting: sorting,
    },
    onSortingChange: setSorting,
    onColumnSizingChange: (updater) => {
      dataDispatch({
        type: ActionTypes.MODIFY_COLUMN_SIZE,
        updater: updater,
        columnSizing: columnSizing,
      });
    },
    onColumnOrderChange: setColumnOrder,
    globalFilterFn: fuzzyFilter,
    meta: tableData,
    defaultColumn: defaultColumn,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable:
      tableData.view.plugin.settings.global_settings.enable_debug_mode,
    debugHeaders:
      tableData.view.plugin.settings.global_settings.enable_debug_mode,
    debugColumns:
      tableData.view.plugin.settings.global_settings.enable_debug_mode,
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
    dataDispatch({
      type: ActionTypes.ADD_ROW,
      filename: inputNewRow,
    });
    setInputNewRow("");
    newRowRef.current.value = "";
  }
  // Manage Templates
  const [rowTemplateState, setRowTemplateState] = React.useState(
    view.diskConfig.yaml.config.current_row_template
  );
  const rowTemplatesOptions = get_tfiles_from_folder(
    view.diskConfig.yaml.config.row_templates_folder
  ).map((tfile) => {
    return {
      value: tfile.path,
      label: tfile.path,
    };
  });

  function handleChangeRowTemplate(
    newValue: OnChangeValue<RowTemplateOption, false>,
    actionMeta: ActionMeta<RowTemplateOption>
  ) {
    const settingsValue = !!newValue ? newValue.value : "";
    dataDispatch({
      type: ActionTypes.CHANGE_ROW_TEMPLATE,
      template: settingsValue,
    });
    setRowTemplateState(settingsValue);
  }

  LOGGER.debug(`<= Table`);
  return (
    <>
      {/* INIT NAVBAR */}
      <HeaderNavBar
        csvButtonProps={{
          columns: columns,
          rows: table.getRowModel().rows,
          name: tableData.view.diskConfig.yaml.name,
        }}
        globalFilterRows={{
          globalFilter: globalFilter,
          setGlobalFilter: setGlobalFilter,
        }}
        headerGroupProps={{
          style: { width: table.getCenterTotalSize() },
        }}
      />
      {/* ENDS NAVBAR */}
      {/* INIT TABLE */}
      <div
        key={`div-table`}
        className={`${c(
          "table noselect cell_size_" +
            tableData.view.diskConfig.yaml.config.cell_size +
            (tableData.view.diskConfig.yaml.config.sticky_first_column
              ? " sticky_first_column"
              : "")
        )}`}
        onMouseOver={onMouseOver}
        onClick={onClick}
        style={{
          width: table.getCenterTotalSize(),
        }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            borderTop: "1px solid var(--background-modifier-border)",
            display: "table-header-group",
          }}
          key={`div-table-sticky`}
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
                  <DndProvider backend={HTML5Backend}>
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
                            table={table}
                            header={header}
                            findColumn={findColumn}
                            headerIndex={headerIndex}
                            columnResizeMode={columnResizeMode}
                            setColumnOrder={setColumnOrder}
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
          style={{
            display: "table-row-group",
          }}
        >
          {table
            .getRowModel()
            .rows.map((row: Row<RowDataType>, rowIndex: number) => (
              <TableCell row={row} rowIndex={rowIndex} />
            ))}

          {/* ENDS BODY */}
        </div>
        {/* ENDS TABLE */}
      </div>
      {/* INIT NEW ROW */}
      <div className={`${c("tr add-row")}`} key={`div-add-row`}>
        <div className={`${c("td")}`} key={`div-add-row-cell`}>
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
          className={`${c("td")}`}
          onClick={handleAddNewRow}
          key={`div-add-row-cell-button`}
        >
          <span className="svg-icon svg-gray" style={{ marginRight: 4 }}>
            <PlusIcon />
          </span>
          New
        </div>
        <div
          className={`${c("padding-left")}`}
          key={`div-add-row-cell-padding-left`}
        >
          <Select
            styles={CustomTemplateSelectorStyles}
            options={rowTemplatesOptions}
            value={{
              label: rowTemplateState,
              value: rowTemplateState,
            }}
            isClearable={true}
            isMulti={false}
            onChange={handleChangeRowTemplate}
            defaultValue={{ label: "Choose a Template", value: "None" }}
            menuPortalTarget={document.body}
            menuShouldBlockScroll={true}
            isSearchable
          />
        </div>
        {/* ENDS NEW ROW */}
      </div>
      {/* INIT DEBUG INFO */}
      {tableData.view.diskConfig.yaml.config.enable_show_state && (
        <pre>
          <code>{JSON.stringify(table.getState(), null, 2)}</code>
        </pre>
      )}
      {/* ENDS DEBUG INFO */}
    </>
  );
}
