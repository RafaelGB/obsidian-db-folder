import * as React from "react";
import { Row, TableOptions, useTable, useBlockLayout, TableInstance } from 'react-table';
import { FixedSizeList } from 'react-window';
import { 
  TableDataType,
  TableRows,
  TableRow, 
  TableColumns
} from "cdm/FolderModel";
import { frontMatterKey } from "parsers/DatabaseParser";
import { DatabaseView } from "DatabaseView";
import { StateManager } from "StateManager";
import { getNormalizedPath } from "helpers/VaultManagement";
import scrollbarWidth from "components/scrollbarWidth";
import { databaseReducer } from "components/reducers/DatabaseDispatch";
import { ActionTypes } from "helpers/Constants";
import PlusIcon from "components/img/Plus";
import { LOGGER } from "services/Logger";

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
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 50,
      width: 150,
      maxWidth: 400,
      sortType: 'alphanumericFalsyLast',
    }),
    []
  )
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
          source: frontMatterKey,
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
    prepareRow,
    totalColumnsWidth
  } = useTable(
    propsUseTable,
    useBlockLayout,
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
   //Render the UI for your table
   const [inputNewRow, setInputNewRow] = React.useState('');
   const newRowRef = React.useRef(null);
   return (
    <div {...getTableProps()} 
    className="table"
    onMouseOver={onMouseOver}
    onClick={onClick}
    >
      <div>
        {headerGroups.map(headerGroup => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map(column => (
              <div {...column.getHeaderProps()} className="th">
                {column.render('Header')}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div {...getTableBodyProps()}>
        <FixedSizeList
          height={400}
          itemCount={rows.length}
          itemSize={35}
          width={totalColumnsWidth+scrollBarSize}
        >
          {RenderRow}
        </FixedSizeList>
          <div className="tr">
            <input type="text"
              ref={newRowRef}
              onChange={(e) => {
                setInputNewRow(e.target.value);
               }                   
              }
              placeholder='filename of new row'
            />
            <div
              className="add-row"
              onClick={() => {
                initialState.dispatch({ 
                type: ActionTypes.ADD_ROW,
                payload: inputNewRow
              });
              setInputNewRow('');
              newRowRef.current.value='';
            }
            }
            >
              <span className="svg-icon svg-gray icon-margin">
                <PlusIcon />
              </span>
              New Row
            </div>
          </div>
      </div>
    </div>
  )
}