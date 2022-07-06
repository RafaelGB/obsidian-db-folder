import * as React from "react";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  TableDataType,
  RowDataType,
  TableColumn,
  RowTemplateOption,
} from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import StateManager from "StateManager";
import { getNormalizedPath } from "helpers/VaultManagement";
import { ActionTypes, DatabaseCore, MetadataColumns } from "helpers/Constants";
import PlusIcon from "components/img/Plus";
import { LOGGER } from "services/Logger";
import DefaultCell from "components/Cell";
import Header from "components/Header";
import { c, getTotalWidth } from "helpers/StylesHelper";
import { HeaderNavBar } from "components/NavBar";
import { getColumnsWidthStyle } from "components/styles/ColumnWidthStyle";
import { HeaderContext } from "components/contexts/HeaderContext";
import { getDndListStyle, getDndItemStyle } from "components/styles/DnDStyle";
import CustomTemplateSelectorStyles from "components/styles/RowTemplateStyles";
import Select, { ActionMeta, OnChangeValue } from "react-select";
import { get_tfiles_from_folder } from "helpers/FileManagement";

const defaultColumn = {
  minWidth: 25,
  maxWidth: 400,
  Cell: DefaultCell,
  Header: Header,
  sortType: "alphanumericFalsyLast",
};

/**
 * Table component based on react-table
 * @param tableDataType
 * @returns
 */
export function TableDemo(tableData: TableDataType) {
  LOGGER.debug(
    `=> Table. number of columns: ${tableData.columns.length}. number of rows: ${tableData.view.rows.length}`
  );
  /** Columns information */
  const columns: TableColumn[] = tableData.columns;
  /** Rows information */
  const data: Array<RowDataType> = tableData.view.rows;
  /** Reducer */
  const dataDispatch = tableData.dispatch;
  /** Database information  */
  const view: DatabaseView = tableData.view;
  const stateManager: StateManager = tableData.stateManager;
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

  function useTableDataInstance(instance: any) {
    Object.assign(instance, { tableData });
  }

  const propsUseTable: any = {
    columns,
    data,
    defaultColumn,
    dataDispatch,
    sortTypes,
  };
  propsUseTable.initialState = tableData.initialState;
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

  const table: any = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  /** Hook to use react-table */
  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   rows,
  //   prepareRow,
  //   // Debug proposes & metainfo
  //   state,
  //   preGlobalFilteredRows,
  //   setGlobalFilter,
  //   allColumns,
  //   setColumnOrder,
  // } = useTable(
  //   // Table properties
  //   propsUseTable,
  //   // React hooks
  //   useFlexLayout,
  //   useFilters,
  //   useGlobalFilter,
  //   useSortBy,
  //   useColumnOrder,
  //   (hooks) => {
  //     hooks.useInstance.push(useTableDataInstance);
  //   }
  // );
  // Manage column width
  const [columnsWidthState, setColumnsWidthState] = React.useState(
    getColumnsWidthStyle(table.rows, columns)
  );
  const totalWidth = getTotalWidth(columnsWidthState);
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
    rows: table.rows,
    name: tableData.view.diskConfig.yaml.name,
  };

  const globalFilterRows = {
    preGlobalFilteredRows: table.preGlobalFilteredRows,
    globalFilter: table.state.globalFilter,
    setGlobalFilter: table.setGlobalFilter,
  };
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
      <div
        {...table.getTableProps({
          style: {
            ...table.getTableProps().style,
            width: totalWidth,
          },
        })}
        className={`${c(
          "table noselect cell_size_" +
            tableData.view.diskConfig.yaml.config.cell_size +
            (tableData.view.diskConfig.yaml.config.sticky_first_column
              ? " sticky_first_column"
              : "")
        )}`}
        onMouseOver={onMouseOver}
        onClick={onClick}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 2,
            borderTop: "1px solid var(--background-modifier-border)",
          }}
        >
          <HeaderNavBar
            csvButtonProps={csvButtonProps}
            globalFilterRows={globalFilterRows}
            headerGroupProps={table.headerGroups[0].getHeaderGroupProps({
              style: { width: getTotalWidth(columnsWidthState) },
            })}
          />
          {/** Headers */}
          {table.headerGroups.map((headerGroup: any, i: number) => (
            <div
              {...headerGroup.getHeaderGroupProps({
                style: {
                  width:
                    totalWidth -
                    columnsWidthState.widthRecord[MetadataColumns.ADD_COLUMN],
                },
              })}
            >
              <DragDropContext
                key={`DragDropContext-${i}`}
                onDragStart={() => {
                  currentColOrder.current = table.allColumns.map(
                    (o: any) => o.id
                  );
                }}
                onDragUpdate={(dragUpdateObj, b) => {
                  const colOrder = [...currentColOrder.current];
                  const sIndex = dragUpdateObj.source.index;
                  const dIndex =
                    dragUpdateObj.destination &&
                    dragUpdateObj.destination.index;

                  if (
                    typeof sIndex === "number" &&
                    typeof dIndex === "number"
                  ) {
                    colOrder.splice(sIndex, 1);
                    colOrder.splice(dIndex, 0, dragUpdateObj.draggableId);
                    table.setColumnOrder(colOrder);
                  }
                }}
                onDragEnd={(result) => {
                  // save on disk in case of changes
                  if (result.source.index !== result.destination!.index) {
                    tableData.view.diskConfig.reorderColumns(
                      table.state.columnOrder
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
                        },
                      })}
                      ref={provided.innerRef}
                      className={`${c("tr header-group")}`}
                    >
                      {headerGroup.headers
                        .filter(
                          (o: any) => o.key !== MetadataColumns.ADD_COLUMN
                        )
                        .map((column: any, index: number) => (
                          <Draggable
                            key={`Draggable-${column.id}`}
                            draggableId={`${column.id}`}
                            index={index}
                            isDragDisabled={
                              (column as unknown as TableColumn).isDragDisabled
                            }
                            disableInteractiveElementBlocking={
                              (column as unknown as TableColumn).isDragDisabled
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
              {headerGroup.headers
                .filter((o: any) => o.key === MetadataColumns.ADD_COLUMN)
                .map((column: any, index: number) => (
                  <div {...column.getHeaderProps()}>
                    <HeaderContext.Provider
                      value={{
                        columnWidthState: columnsWidthState,
                        setColumnWidthState: setColumnsWidthState,
                      }}
                    >
                      {column.render("Header")}
                    </HeaderContext.Provider>
                  </div>
                ))}
            </div>
          ))}
        </div>
        {/** Body */}
        <div {...table.getTableBodyProps()}>
          {table.rows.map((row: any, i: number) => {
            table.prepareRow(row);
            return (
              <div
                {...row.getRowProps({
                  style: {
                    width: `${totalWidth}px`,
                  },
                })}
                className={`${c("tr")}`}
                key={row.id}
              >
                {row.cells.map((cell: any) => {
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
              <div className={`${c("td")}`} onClick={handleAddNewRow}>
                <span className="svg-icon svg-gray" style={{ marginRight: 4 }}>
                  <PlusIcon />
                </span>
                New
              </div>
              <div className={`${c("padding-left")}`}>
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
            </div>
          </div>
        </div>
        {tableData.view.diskConfig.yaml.config.enable_show_state && (
          <pre>
            <code>{JSON.stringify(table.state, null, 2)}</code>
          </pre>
        )}
      </div>
    </>
  );
}
