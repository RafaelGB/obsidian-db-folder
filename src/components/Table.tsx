import * as React from "react";
import { Cell, Row, useTable } from 'react-table';
import { 
  TableDataType,
  TableRows,
  TableRow 
} from "cdm/FolderModel";
import {makeData } from 'mock/mockUtils';
import { frontMatterKey } from "parsers/DatabaseParser";
import { TFile } from "obsidian";
import { DatabaseView } from "DatabaseView";
import { StateManager } from "StateManager";
import { getNormalizedPath } from "helpers/VaultManagement";

const borderStyle = {
  border: "1px solid gray",
  padding: "8px 10px"
};

/**
 * Render entire row of elements inside table
 * @param row 
 * @returns 
 */
function renderRow(row:Row) { 
  return (
    <tr {...row.getRowProps()}>
        {row.cells.map(
          (cell:any) => renderCell(cell)
          )
        }
    </tr>
  )
}

/**
 * Render individual cell inside table
 * @param cell 
 * @returns 
 */
function renderCell(cell:any) {
  if (cell.isRowSpanned) return null;
  else
    return (
      <td
        style={borderStyle}
        rowSpan={cell.rowSpan}
        {...cell.getCellProps()}
      >
        {cell.render("Cell")}
      </td>
    );
}

function useInstance(instance:any) {
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
 * @param properties 
 * @returns 
 */
export function Table(properties: TableDataType){
  /** Columns information */
  const columns = properties.columns;
  /** Rows information */
  const sourceData: TableRows = properties.data;
  /**   */
  const view:DatabaseView = properties.view;
  const stateManager:StateManager = properties.stateManager;
  const filePath = stateManager.file.path;

  /** Rows showed information */
  const data = React.useMemo(() => filterDataWithcolumnHeaders(sourceData,columns.map(column => column.Header)), []);
  let propsUseTable:any = {columns, data};
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
  /** Hook to use react-table */
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow
  } = useTable(propsUseTable, hooks => {
    hooks.useInstance.push(useInstance);
  });
/** return table structure */
  return (
    <table 
    onMouseOver={onMouseOver}
    onClick={onClick}
    {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()} style={borderStyle}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return renderRow(row);
        })}
      </tbody>
    </table>
  );
}

function filterDataWithcolumnHeaders(data:TableRows,columnHeaders:string[]): TableRows{
  let filterData:TableRows = [];
  let id:number = 0;
  data.forEach(row => {
    let newRow:TableRow={
      id: ++id,
      title:row.title
    };
    columnHeaders.forEach(columnHeader => {
      newRow[columnHeader] = row[columnHeader] ? row[columnHeader] : '';
    });
    filterData.push(newRow);
  });
  return filterData;
}