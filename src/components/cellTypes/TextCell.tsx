import { CellComponentProps } from "cdm/ComponentsModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import React, { MouseEventHandler, useEffect, useRef } from "react";
import { useState } from "react";
import EditorCell from "components/cellTypes/EditorCell";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { DataObject, Literal } from "obsidian-dataview";
import {
  deepMerge,
  generateLiteral,
  obtainAnidatedLiteral,
} from "helpers/DataObjectHelper";

const TextCell = (props: CellComponentProps) => {
  const { defaultCell } = props;
  const { cell, column, table, row } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const textRow = tableState.data((state) => state.rows[row.index]);

  const configInfo = table.options.meta.tableState.configState(
    (state) => state.info
  );

  const columnsInfo = table.options.meta.tableState.columns(
    (state) => state.info
  );

  const dataActions = table.options.meta.tableState.data(
    (state) => state.actions
  );

  const textCell = tableState.data((state) =>
    parseTextRowToString(state.rows[row.index], tableColumn)
  );

  /** Ref to cell container */
  const containerCellRef = useRef<HTMLDivElement>();
  const [dirtyCell, setDirtyCell] = useState(false);

  /**
   * Render markdown content of Obsidian on load
   */
  useEffect(() => {
    if (dirtyCell) {
      // End useEffect
      return;
    }
    if (containerCellRef.current !== undefined) {
      containerCellRef.current.innerHTML = "";

      renderMarkdown(defaultCell, textCell, containerCellRef.current, 5);
    }
  }, [dirtyCell, cell.getValue()]);

  const handleEditableOnclick: MouseEventHandler<HTMLSpanElement> = () => {
    setDirtyCell(true);
  };

  const persistChange = (changedValue: string) => {
    if (changedValue !== undefined && changedValue !== textCell) {
      const newCell = parseStringToTextRow(textRow, tableColumn, changedValue);
      dataActions.updateCell(
        row.index,
        tableColumn,
        newCell,
        columnsInfo.getAllColumns(),
        configInfo.getLocalSettings()
      );
    }
    setDirtyCell(false);
  };

  return dirtyCell ? (
    <EditorCell
      defaultCell={defaultCell}
      persistChange={persistChange}
      textCell={textCell}
    />
  ) : (
    <span
      ref={containerCellRef}
      onClick={handleEditableOnclick}
      style={{ width: column.getSize() }}
      className={c(
        getAlignmentClassname(tableColumn.config, configInfo.getLocalSettings())
      )}
    />
  );
};

/**
 * Manage the value of the cell to render as string
 * @param row
 * @param column
 * @returns
 */
function parseTextRowToString(row: RowDataType, column: TableColumn) {
  const cellRoot = row[column.id];
  let textCell = "";
  if (column.nestedId && cellRoot !== undefined) {
    textCell = obtainAnidatedLiteral(column.nestedId, cellRoot as DataObject);
  } else {
    textCell = cellRoot?.toString();
  }
  return textCell;
}

/**
 * Manage the value of the rendered string to save as Literal cell
 * @param row
 * @param column
 * @param newValue
 * @returns
 */
function parseStringToTextRow(
  row: RowDataType,
  column: TableColumn,
  newValue: string
): Literal {
  const originalValue = row[column.id];
  if (column.nestedId) {
    try {
      // Generate object with the new value using the nested key anidated in fuction of split .
      const target = (originalValue as DataObject) ?? {};
      const source = generateLiteral(column.nestedId, newValue);
      return deepMerge(source, target);
    } catch (e) {
      // Just return the original value
    }
  }
  return newValue.trim();
}

export default TextCell;
