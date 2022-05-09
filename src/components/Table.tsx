import * as React from "react";
import {
  useTable,
  TableInstance,
  useFlexLayout,
  useSortBy,
  useGlobalFilter,
  useColumnOrder,
  useFilters,
  Column,
} from "react-table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { TableDataType, RowDataType, TableColumn } from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import StateManager from "StateManager";
import { getNormalizedPath } from "helpers/VaultManagement";
import { ActionTypes, DatabaseCore } from "helpers/Constants";
import PlusIcon from "components/img/Plus";
import { LOGGER } from "services/Logger";
import DefaultCell from "components/Cell";
import Header from "components/Header";
import { c } from "helpers/StylesHelper";
import { HeaderNavBar } from "components/NavBar";
import { getColumnsWidthStyle } from "components/styles/ColumnWidthStyle";
import { HeaderContext } from "components/contexts/HeaderContext";
import { getDndListStyle, getDndItemStyle } from "./styles/DnDStyle";

const defaultColumn = {
  minWidth: 50,
  maxWidth: 400,
  Cell: DefaultCell,
  Header: Header,
  sortType: "alphanumericFalsyLast",
};

/**
 * Table component based on react-table
 * @param initialState
 * @returns
 */
export function Table(initialState: TableDataType) {
  LOGGER.debug(
    `=> Table. number of columns: ${initialState.columns.length}. number of rows: ${initialState.data.length}`
  );
  /** Columns information */
  const columns: TableColumn[] = initialState.columns;
  /** Rows information */
  const data: Array<RowDataType> = initialState.data;
  /** Reducer */
  const dataDispatch = initialState.dispatch;
  /** Database information  */
  const view: DatabaseView = initialState.view;
  const stateManager: StateManager = initialState.stateManager;
  const filePath = stateManager.file.path;
  /** Sort columns */
  const sortTypes = React.useMemo(
    () => ({
      alphanumericFalsyLast(
        rowA: any,
        rowB: any,
        columnId: string,
        desc: boolean
      ) {
        if (!rowA.values[columnId] && !rowB.values[columnId]) {
          return 0;
        }

        if (!rowA.values[columnId]) {
          return desc ? -1 : 1;
        }

        if (!rowB.values[columnId]) {
          return desc ? 1 : -1;
        }

        return isNaN(rowA.values[columnId])
          ? rowA.values[columnId].localeCompare(rowB.values[columnId])
          : rowA.values[columnId] - rowB.values[columnId];
      },
    }),
    []
  );

  function useTableDataInstance(instance: TableInstance<TableDataType>) {
    Object.assign(instance, { initialState });
  }

  const propsUseTable: any = {
    columns,
    data,
    defaultColumn,
    dataDispatch,
    sortTypes,
  };
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

  /** Hook to use react-table */
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    // Debug proposes & metainfo
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    allColumns,
    setColumnOrder,
    totalColumnsWidth,
  } = useTable(
    // Table properties
    propsUseTable,
    // React hooks
    useFlexLayout,
    useFilters,
    useGlobalFilter,
    useSortBy,
    useColumnOrder,
    (hooks) => {
      hooks.useInstance.push(useTableDataInstance);
    }
  );
  // Manage column width
  const [columnsWidthState, setColumnsWidthState] = React.useState(
    getColumnsWidthStyle(rows, columns)
  );
  // Manage DnD
  const currentColOrder = React.useRef(null);
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

  // Manage NavBar
  const csvButtonProps = {
    columns: columns,
    rows: rows,
    name: initialState.view.diskConfig.yaml.name,
  };

  const globalFilterRows = {
    preGlobalFilteredRows: preGlobalFilteredRows,
    globalFilter: (state as any).globalFilter,
    setGlobalFilter: setGlobalFilter,
  };
  LOGGER.debug(`<= Table`);
  return (
    <>
      <div
        {...getTableProps({
          style: {
            ...getTableProps().style,
            width: totalColumnsWidth,
          },
        })}
        className={`${c("table noselect")}`}
        onMouseOver={onMouseOver}
        onClick={onClick}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            borderTop: "1px solid var(--background-modifier-border)",
          }}
        >
          <HeaderNavBar
            csvButtonProps={csvButtonProps}
            globalFilterRows={globalFilterRows}
            headerGroupProps={headerGroups[0].getHeaderGroupProps({
              style: { width: totalColumnsWidth },
            })}
          />
          {/** Headers */}
          {headerGroups.map((headerGroup, i) => (
            <DragDropContext
              key={`DragDropContext-${i}`}
              onDragStart={() => {
                currentColOrder.current = allColumns.map((o: Column) => o.id);
              }}
              onDragUpdate={(dragUpdateObj, b) => {
                const colOrder = [...currentColOrder.current];
                const sIndex = dragUpdateObj.source.index;
                const dIndex =
                  dragUpdateObj.destination && dragUpdateObj.destination.index;

                if (typeof sIndex === "number" && typeof dIndex === "number") {
                  colOrder.splice(sIndex, 1);
                  colOrder.splice(dIndex, 0, dragUpdateObj.draggableId);
                  setColumnOrder(colOrder);
                }
              }}
              onDragEnd={(result) => {
                // save on disk in case of changes
                if (result.source.index !== result.destination!.index) {
                  initialState.view.diskConfig.reorderColumns(
                    (state as any).columnOrder
                  );
                }

                // clear the current order
                currentColOrder.current = null;
              }}
            >
              <Droppable
                key={`Droppable-${i}`}
                droppableId="droppable"
                direction="horizontal"
              >
                {(provided, snapshot) => (
                  <div
                    key={`div-Droppable-${i}`}
                    {...provided.droppableProps}
                    {...headerGroup.getHeaderGroupProps({
                      style: {
                        ...getDndListStyle(snapshot.isDraggingOver),
                        width: totalColumnsWidth,
                      },
                    })}
                    ref={provided.innerRef}
                    className={`${c("tr header-group")}`}
                  >
                    {headerGroup.headers.map((column, index) => (
                      <Draggable
                        key={`Draggable-${column.id}`}
                        draggableId={`${column.id}`}
                        index={index}
                        isDragDisabled={(column as any).skipPersist}
                        disableInteractiveElementBlocking={
                          (column as any).skipPersist
                        }
                      >
                        {(provided, snapshot) => {
                          const tableCellBaseProps = {
                            ...provided.draggableProps,
                            ...provided.dragHandleProps,
                            ...column.getHeaderProps({
                              style: {
                                width: `${
                                  columnsWidthState.widthRecord[column.id]
                                }px`,
                                ...getDndItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                ),
                              },
                            }),
                            className: `${c("th noselect")} header`,
                            key: `div-Draggable-${column.id}`,
                            // {...extraProps}
                            ref: provided.innerRef,
                          };
                          return (
                            <div {...tableCellBaseProps}>
                              <HeaderContext.Provider
                                value={{
                                  columnWidthState: columnsWidthState,
                                  setColumnWidthState: setColumnsWidthState,
                                }}
                              >
                                {column.render("Header")}
                              </HeaderContext.Provider>
                            </div>
                          );
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ))}
        </div>
        {/** Body */}
        <div {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <div
                {...row.getRowProps({
                  style: {
                    maxWidth: `${totalColumnsWidth}px`,
                  },
                })}
                className={`${c("tr")}`}
                key={row.id}
              >
                {row.cells.map((cell) => {
                  const tableCellBaseProps = {
                    ...cell.getCellProps({
                      style: {
                        width: columnsWidthState.widthRecord[cell.column.id],
                      },
                    }),
                    className: `${c("td")}`,
                  };
                  return (
                    <div {...tableCellBaseProps}>{cell.render("Cell")}</div>
                  );
                })}
              </div>
            );
          })}
          <div className={`${c("tr add-row")}`}>
            <div className={`${c("td")}`}>
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
            <div className={`${c("td")}`} onClick={handleAddNewRow}>
              <span className="svg-icon svg-gray" style={{ marginRight: 4 }}>
                <PlusIcon />
              </span>
              New
            </div>
          </div>
        </div>
        {initialState.view.diskConfig.yaml.config.enable_show_state && (
          <pre>
            <code>{JSON.stringify(state, null, 2)}</code>
          </pre>
        )}
      </div>
    </>
  );
}
