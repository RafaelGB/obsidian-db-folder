import { CellComponentProps } from "cdm/ComponentsModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import React, { MouseEventHandler, useEffect, useRef } from "react";
import { useState } from "react";
import EditorCell from "components/cellTypes/EditorCell";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { DataObject, Literal } from "obsidian-dataview";
import { LOGGER } from "services/Logger";

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

  const textCell = parseTextRowToString(textRow, tableColumn);
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
  console.log("parseTextRowToString");
  const cellRoot = row[column.id];
  let textCell = "";
  if (column.config.isNested && cellRoot !== undefined) {
    textCell = obtainAnidatedValue(
      column.config.nested_key ?? column.id,
      cellRoot as DataObject
    );
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
  console.log("parseStringToTextRow");
  const originalValue = row[column.id];
  if (column.config.isNested) {
    try {
      // Generate object with the new value using the nested key anidated in fuction of split .
      const newObject = {
        ...((originalValue as DataObject) ?? {}),
        ...generateLiteral(column.config.nested_key ?? column.id, newValue),
      };
      return newObject;
    } catch (e) {
      // Just return the original value
    }
  }
  return newValue.trim();
}

/**
 * Obtain the value of a nested object in function of the nested key (a.b.c) using recursion
 * I.E.:
 * nestedKey = "a.b.c"
 * object = {a: {b: {c: "test"}}}
 * expected result = "test"
 * @param nestedKey
 * @param original
 */
function obtainAnidatedValue(nestedKey: string, original: DataObject): string {
  const keys = nestedKey.split(".");
  const key = keys.shift();
  const currentLvlValue = original[key];
  if (currentLvlValue === undefined) {
    LOGGER.warn(
      `nested key ${nestedKey} not found in object ${original}. Returning original by default`
    );
    return JSON.stringify(original);
  }
  if (keys.length === 0) {
    const value = original[key];
    if (typeof value === "object") {
      return JSON.stringify(value);
    } else {
      return value?.toString();
    }
  } else {
    return obtainAnidatedValue(keys.join("."), original[key] as DataObject);
  }
}

/**
 * Create an object in function of the nested key (a.b.c) and the value to set in the last key
 * I.E.:
 * nestedKey = "a.b.c"
 * value = "test"
 * expected result = {a: {b: {c: "test"}}}
 * @param nestedKey
 * @param value
 */
function generateLiteral(nestedKey: string, value: any): DataObject {
  const keys = nestedKey.split(".");
  const lastKey = keys.pop();
  const lastObject = { [lastKey]: value };
  return keys.reverse().reduce((acc, key) => ({ [key]: acc }), lastObject);
}

export default TextCell;
