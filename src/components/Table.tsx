import * as React from "react";
import { TableOptions, useTable, useBlockLayout, TableInstance, useFlexLayout, useResizeColumns, useSortBy } from 'react-table';
import { FixedSizeList } from 'react-window';
import clsx from "clsx";
import { 
  TableDataType,
  TableRows,
  TableColumns
} from "cdm/FolderModel";
import { DatabaseView } from "DatabaseView";
import { StateManager } from "StateManager";
import { getNormalizedPath } from "helpers/VaultManagement";
import scrollbarWidth from "components/scrollbarWidth";
import { databaseReducer } from "components/reducers/DatabaseDispatch";
import { ActionTypes, DatabaseCore } from "helpers/Constants";
//import { c } from "helpers/StylesHelper";
import PlusIcon from "components/img/Plus";
import { LOGGER } from "services/Logger";
import Cell from "components/Cell";
import Header from "components/Header";

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
  const columns:TableColumns = initialState.columns;
  /** Rows information */
  const data: TableRows = initialState.data;
  /** Reducer */
  const stateReducer = databaseReducer;
  /** Database information  */
  const view:DatabaseView = initialState.view;
  const stateManager:StateManager = initialState.stateManager;
  const filePath = stateManager.file.path;
  
  let propsUseTable:TableOptions<any> = {
    columns, 
    data, 
    defaultColumn,
    stateReducer
  };
  /** Obsidian hooks to markdown events */
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

      // Open an internal link in a new pane
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
  const scrollBarSize = React.useMemo(() => scrollbarWidth(), [])

  /** Hook to use react-table */
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(
    propsUseTable,
    useFlexLayout,
    useResizeColumns,
    useSortBy,
    hooks => {
      hooks.useInstance.push(useInstance);
    }
  );
  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index]
      prepareRow(row)
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="tr"
        >
          {row.cells.map(cell => {
            return (
              <div {...cell.getCellProps()} className="td">
                {cell.render('Cell')}
              </div>
            )
          })}
        </div>
      )
    },
    [prepareRow, rows]
  )
    LOGGER.debug(`<= Table`);

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
    // Manage input of new row
    const [inputNewRow, setInputNewRow] = React.useState('');
    const newRowRef = React.useRef(null);
    return (
      <>
        <div {...getTableProps()} 
        className={clsx("table", isTableResizing() && "noselect")}
        onMouseOver={onMouseOver}
        onClick={onClick}
        >
          <div>
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className='tr'>
                {headerGroup.headers.map((column) => column.render("Header"))}
              </div>
            ))}
          </div>
          <div {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <div {...row.getRowProps()} className='tr'>
                  {row.cells.map((cell) => (
                    <div {...cell.getCellProps()} className='td'>
                      {cell.render("Cell")}
                    </div>
                  ))}
                </div>
              );
            })}
            <div 
              className='tr add-row' 
              onClick={() => 
                {
                  initialState.dispatch({ 
                    type: ActionTypes.ADD_ROW,
                    payload: inputNewRow
                  });
                  setInputNewRow('');
                  newRowRef.current.value='';
                }
              }
            >
              <input type="text"
                ref={newRowRef}
                onChange={(e) => {
                  setInputNewRow(e.target.value);
                  } 
                }
                placeholder='filename of new row'
              />
              <span className='svg-icon svg-gray' style={{marginRight: 4}}>
                <PlusIcon />
              </span>
              New
            </div>
          </div>
        </div>
      </>
    );
    //Render the UI for your table
  //   return (
  //     <div {...getTableProps()} 
  //     className={c("table")}
  //     onMouseOver={onMouseOver}
  //     onClick={onClick}
  //     >
  //     <div>
  //       {headerGroups.map(headerGroup => (
  //         <div {...headerGroup.getHeaderGroupProps()} className={c("tr")}>
  //           {headerGroup.headers.map(column => (
  //             <div {...column.getHeaderProps()} className={c("th")}>
  //               {column.render('Header')}
  //             </div>
  //           ))}
  //         </div>
  //       ))}
  //     </div>

  //     <div {...getTableBodyProps()}>
  //       <FixedSizeList
  //         height={400}
  //         itemCount={rows.length}
  //         itemSize={35}
  //         width={totalColumnsWidth+scrollBarSize}
  //       >
  //         {RenderRow}
  //       </FixedSizeList>
  //       <div className={c("tr add-row")}>
  //         <input type="text"
  //           ref={newRowRef}
  //           onChange={(e) => {
  //             setInputNewRow(e.target.value);
  //             } 
  //           }
  //           placeholder='filename of new row'
  //         />
  //         <div
  //           onClick={() => {
  //             initialState.dispatch({ 
  //             type: ActionTypes.ADD_ROW,
  //             payload: inputNewRow
  //           });
  //           setInputNewRow('');
  //           newRowRef.current.value='';
  //         }
  //         }
  //         >
  //           <span className={c("svg-icon svg-gray icon-margin")}>
  //             <PlusIcon />
  //           </span>
  //           New Row
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
}