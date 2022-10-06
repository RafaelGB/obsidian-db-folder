import { CellComponentProps } from "cdm/ComponentsModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import React, { MouseEventHandler, useEffect, useRef } from "react";
import { useState } from "react";
import EditorCell from "components/cellTypes/EditorCell";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { Literal } from "obsidian-dataview";

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

  const textCell = parseTextRowToString(textRow, column.id);
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
      const newCell = parseStringToTextRow(textRow, column.id, changedValue);
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

function parseTextRowToString(row: RowDataType, columnId: string) {
  const cellRoot = row[columnId];
  let textCell = "";
  if (typeof cellRoot === "object") {
    textCell = JSON.stringify(cellRoot);
  } else {
    textCell = cellRoot?.toString();
  }
  return textCell;
}

function parseStringToTextRow(
  row: RowDataType,
  columnId: string,
  newValue: string
): Literal {
  const cellRoot = row[columnId];
  if (
    typeof cellRoot === "object" ||
    (newValue.startsWith("{") && newValue.endsWith("}"))
  ) {
    // TODO control anidated values in function of columnId spliting by "."
    try {
      newValue = JSON.parse(newValue);
    } catch (e) {
      // Just return the original value
    }
  } else {
    newValue = newValue.trim();
  }
  return newValue;
}

export default TextCell;
