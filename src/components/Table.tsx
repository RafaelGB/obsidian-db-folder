import * as React from "react";
import { 
  useTable, 
  TableInstance, 
  useFlexLayout, 
  useResizeColumns, 
  useSortBy, 
  useGlobalFilter, 
  useColumnOrder, 
  useFilters 
} from 'react-table';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import clsx from "clsx";
import { 
  TableDataType,
  TableRow,
  TableColumn
} from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import { StateManager } from "StateManager";
import { getNormalizedPath } from "helpers/VaultManagement";
import { ActionTypes, DatabaseCore } from "helpers/Constants";
import PlusIcon from "components/img/Plus";
import { LOGGER } from "services/Logger";
import Cell from "components/Cell";
import Header from "components/Header";
import GlobalFilter from "components/reducers/GlobalFilter";
import DraggableStyle from "components/styles/DragableStyle";

const defaultColumn = {
  minWidth: 50,
  width: 150,
  maxWidth: 400,
  Cell: Cell,
  Header: Header,
  sortType: 'alphanumericFalsyLast',
};

function useInstance(instance:TableInstance<any>) {
  const { allColumns } = instance;

  let rowSpanHeaders:any = [];

  allColumns.forEach((column:any, i:any) => {
    const { id } = column;
      rowSpanHeaders = [
        ...rowSpanHeaders,
        { id, topCellValue: null, topCellIndex: 0 }
      ];
  });

  Object.assign(instance, { rowSpanHeaders });
}

/**
 * Table component based on react-table
 * @param initialState 
 * @returns 
 */
export function Table(initialState: TableDataType){
  LOGGER.debug(`=> Table. number of columns: ${initialState.columns.length}. number of rows: ${initialState.data.length}`);
  /** Columns information */
  const columns:TableColumn[] = initialState.columns;
  /** Rows information */
  const data: Array<TableRow> = initialState.data;
  /** Reducer */
  const dataDispatch = initialState.dispatch;
  /** Database information  */
  const view:DatabaseView = initialState.view;
  const stateManager:StateManager = initialState.stateManager;
  const filePath = stateManager.file.path;
  /** Sort columns */
  const sortTypes = React.useMemo(
    () => ({
      alphanumericFalsyLast(rowA:any, rowB:any, columnId:string, desc:boolean) {
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
      }
    }),
    []
  );
  let propsUseTable:any = {
    columns, 
    data, 
    defaultColumn,
    dataDispatch,
    sortTypes
  };
  /** Obsidian event to show page preview */
  const onMouseOver = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      
      const targetEl = e.target as HTMLElement;
      if (targetEl.tagName !== 'A' || !view) return;

      if (targetEl.hasClass('internal-link')) {
        view.app.workspace.trigger('hover-link', {
          event: e.nativeEvent,
          source: DatabaseCore.FRONTMATTER_KEY,
          hoverParent: view,
          targetEl,
          linktext: targetEl.getAttr('href'),
          sourcePath: view.file.path,
        });
      }
    },
    [view]
  );
  /** Obsidian to open an internal link in a new pane */
  const onClick = React.useCallback(
    async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.type === 'auxclick' && e.button == 2) {
        return;
      }

      const targetEl = e.target as HTMLElement;
      const closestAnchor =
        targetEl.tagName === 'A' ? targetEl : targetEl.closest('a');

      if (!closestAnchor) return;

      if (closestAnchor.hasClass('file-link')) {
        e.preventDefault();
        const href = closestAnchor.getAttribute('href');
        const normalizedPath = getNormalizedPath(href);
        const target =
          typeof href === 'string' &&
          view.app.metadataCache.getFirstLinkpathDest(
            normalizedPath.root,
            view.file.path
          );

        if (!target) return;

        (stateManager.app as any).openWithDefaultApp(target.path);

        return;
      }

      if (closestAnchor.hasClass('internal-link')) {
        e.preventDefault();
        const destination = closestAnchor.getAttr('href');
        const inNewLeaf = e.button === 1 || e.ctrlKey || e.metaKey;
        const isUnresolved = closestAnchor.hasClass('is-unresolved');

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
    setColumnOrder
  } = useTable(
    // Table properties
    propsUseTable,
    // React hooks
    useFlexLayout,
    useResizeColumns,
    useFilters, 
    useGlobalFilter,
    useSortBy,
    useColumnOrder,
    hooks => {
      hooks.useInstance.push(useInstance);
    }
  );
    function isTableResizing() {
      for (let headerGroup of headerGroups) {
        for (let column of headerGroup.headers) {
          if ((column as any).isResizing) {
            return true;
          }
        }
      }
  
      return false;
    }
    // Manage DnD
    const currentColOrder = React.useRef(null);
    // Manage input of new row
    const [inputNewRow, setInputNewRow] = React.useState('');
    const newRowRef = React.useRef(null);
    LOGGER.debug(`<= Table`);
    return (
      <>
        <div {...getTableProps()} 
        className={clsx("table", isTableResizing() && "noselect")}
        onMouseOver={onMouseOver}
        onClick={onClick}
        >
          <div>
            {/** Headers */}
            {headerGroups.map((headerGroup,i) => (
              <DragDropContext
                key={`DragDropContext-${i}`}
                onDragStart={() => {
                currentColOrder.current = allColumns.map((o:any) => o.id);
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
                onDragEnd={() => {
                  // save on disk
                  initialState.diskConfig.reorderColumns((state as any).columnOrder);
                  // clear the current order
                  currentColOrder.current = null;
                }}
              >
              <Droppable key={`Droppable-${i}`} droppableId="droppable" direction="horizontal">
                {(droppableProvided, snapshot) => (
                  <div 
                    {...headerGroup.getHeaderGroupProps()} 
                    ref={droppableProvided.innerRef}
                    className='tr'
                  >
                    {headerGroup.headers.map((column,index) => (
                      
                      <Draggable
                      key={`Draggable-${column.id}`}
                      draggableId={`${column.id}`}
                      index={index}
                      isDragDisabled={!(column as any).accessor}
                    >
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...column.getHeaderProps()}
                            className='th noselect'
                          >
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              // {...extraProps}
                              ref={provided.innerRef}
                              style={{
                                ...DraggableStyle({
                                  dragableProps: snapshot,
                                  draggableStyle: provided.draggableProps.style
                                })
                                // ...style
                              }}
                            >
                              {column.render("Header")}
                            </div>
                          </div>
                        );
                      }}
                    </Draggable>
                  ))}
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            ))}
            {/** Global filter */}
            <div className='tr'>
              <div
                className='th'
                key="global-filter"
                style={{
                  textAlign: 'left',
                }}
              >
                <GlobalFilter
                  preGlobalFilteredRows={preGlobalFilteredRows}
                  globalFilter={(state as any).globalFilter}
                  setGlobalFilter={setGlobalFilter}
                />
              </div>
            </div>
          </div>
          {/** Body */}
          <div {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <div {...row.getRowProps()} className='tr' key={row.id} >
                  {row.cells.map((cell) => (
                    <div {...cell.getCellProps()} className='td'>
                      {cell.render("Cell")}
                    </div>
                  ))}
                </div>
              );
            })}
            <div className='tr add-row'>
              <input type="text"
                ref={newRowRef}
                onChange={(e) => {
                  setInputNewRow(e.target.value);
                  } 
                }
                placeholder='filename of new row'
              />
              <div onClick={() => 
                  {
                    dataDispatch({ 
                      type: ActionTypes.ADD_ROW,
                      filename: inputNewRow
                    });
                    setInputNewRow('');
                    newRowRef.current.value='';
                  }
                }
              >
                <span className='svg-icon svg-gray' style={{marginRight: 4}}>
                  <PlusIcon />
                </span>
                New
              </div>
            </div>
          </div>
          <pre>
            <code>{JSON.stringify(state, null, 2)}</code>
          </pre>
        </div>
      </>
    );
}