import * as React from "react";
import {
  useTable,
  TableInstance,
  useFlexLayout,
  useSortBy,
  useGlobalFilter,
  useColumnOrder,
  useFilters,
} from "react-table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { TableDataType, RowDataType, TableColumn } from "cdm/FolderModel";
import MaUTable from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { DatabaseView } from "DatabaseView";
import { StateManager } from "StateManager";
import { getNormalizedPath } from "helpers/VaultManagement";
import { ActionTypes, DatabaseCore } from "helpers/Constants";
import PlusIcon from "components/img/Plus";
import { LOGGER } from "services/Logger";
import DefaultCell from "components/Cell";
import Header from "components/Header";
import { useDraggableInPortal } from "components/portals/UseDraggableInPortal";
import { c } from "helpers/StylesHelper";
import { HeaderNavBar } from "components/NavBar";
import getColumnsWidthStyle from "components/styles/ColumnWidthStyle";

const defaultColumn = {
  minWidth: 50,
  maxWidth: 400,
  Cell: DefaultCell,
  Header: Header,
  sortType: "alphanumericFalsyLast",
};

function useInstance(instance: TableInstance<any>) {
  const { allColumns } = instance;

  let rowSpanHeaders: any = [];

  allColumns.forEach((column: any, i: any) => {
    const { id } = column;
    rowSpanHeaders = [
      ...rowSpanHeaders,
      { id, topCellValue: null, topCellIndex: 0 },
    ];
  });

  Object.assign(instance, { rowSpanHeaders });
}

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
      hooks.useInstance.push(useInstance);
    }
  );
  // Manage column width
  const [columnsWidthStyle, setColumnsWidthStyle] = React.useState(
    getColumnsWidthStyle(rows, columns)
  );
  const [isDragUpdate, setDragUpdate] = React.useState(false);
  // Manage DnD
  const currentColOrder = React.useRef(null);
  const renderDraggable = useDraggableInPortal();
  // Manage input of new row
  const [inputNewRow, setInputNewRow] = React.useState("");
  const newRowRef = React.useRef(null);
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
      <MaUTable
        stickyHeader={true}
        {...getTableProps()}
        style={{ display: "flex", flexDirection: "column" }}
        onMouseOver={onMouseOver}
        onClick={onClick}
      >
        <TableHead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
          }}
        >
          <HeaderNavBar
            csvButtonProps={csvButtonProps}
            globalFilterRows={globalFilterRows}
            headerGroupProps={headerGroups[0].getHeaderGroupProps()}
          />
          {/** Headers */}
          {headerGroups.map((headerGroup, i) => (
            <DragDropContext
              key={`DragDropContext-${i}`}
              onDragStart={() => {
                currentColOrder.current = allColumns.map((o: any) => o.id);
              }}
              onDragUpdate={(dragUpdateObj, b) => {
                if (!isDragUpdate) {
                  setDragUpdate(true);
                }
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
                setDragUpdate(false);
              }}
            >
              <Droppable
                key={`Droppable-${i}`}
                droppableId="droppable"
                direction="horizontal"
              >
                {(droppableProvided, snapshot) => (
                  <TableRow
                    key={`div-Droppable-${i}`}
                    {...headerGroup.getHeaderGroupProps()}
                    ref={droppableProvided.innerRef}
                    className={`${c("tr")} header-group`}
                  >
                    {headerGroup.headers.map((column, index) => (
                      <Draggable
                        key={`Draggable-${column.id}`}
                        draggableId={`${column.id}`}
                        index={index}
                        isDragDisabled={(column as any).isMetadata}
                      >
                        {renderDraggable((provided) => {
                          const tableCellBaseProps = {
                            ...column.getHeaderProps(),
                            className: `${c("th noselect")} header`,
                            key: `div-Draggable-${column.id}`,
                            ...provided.draggableProps,
                            ...provided.dragHandleProps,
                            // {...extraProps}
                            ref: provided.innerRef,
                          };
                          const tableCellProps = isDragUpdate
                            ? tableCellBaseProps
                            : {
                                ...tableCellBaseProps,
                                style: {
                                  width: `${columnsWidthStyle[column.id]}px`,
                                },
                              };
                          return (
                            <TableCell {...tableCellProps}>
                              {column.render("Header")}
                            </TableCell>
                          );
                        })}
                      </Draggable>
                    ))}
                    {droppableProvided.placeholder}
                  </TableRow>
                )}
              </Droppable>
            </DragDropContext>
          ))}
        </TableHead>
        {/** Body */}
        <TableBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow
                {...row.getRowProps()}
                className={`${c("tr")}`}
                key={row.id}
              >
                {row.cells.map((cell) => {
                  const tableCellBaseProps = {
                    ...cell.getCellProps(),
                    className: `${c("td")}`,
                  };
                  const tableCellProps = isDragUpdate
                    ? tableCellBaseProps
                    : {
                        ...tableCellBaseProps,
                        style: {
                          width: columnsWidthStyle[cell.column.id],
                        },
                      };
                  return (
                    <TableCell {...tableCellProps}>
                      {cell.render("Cell")}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
          <TableRow className={`${c("tr add-row")}`}>
            <TableCell className={`${c("td")}`}>
              <input
                type="text"
                ref={newRowRef}
                onChange={(e) => {
                  setInputNewRow(e.target.value);
                }}
                placeholder="filename of new row"
              />
            </TableCell>
            <TableCell className={`${c("td")}`}>
              <div
                onClick={() => {
                  dataDispatch({
                    type: ActionTypes.ADD_ROW,
                    filename: inputNewRow,
                  });
                  setInputNewRow("");
                  newRowRef.current.value = "";
                }}
              >
                <span className="svg-icon svg-gray" style={{ marginRight: 4 }}>
                  <PlusIcon />
                </span>
                New
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
        {initialState.view.diskConfig.yaml.config.enable_show_state && (
          <pre>
            <code>{JSON.stringify(state, null, 2)}</code>
          </pre>
        )}
      </MaUTable>
    </>
  );
}
