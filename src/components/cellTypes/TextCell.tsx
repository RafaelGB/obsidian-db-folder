import { CellComponentProps } from "cdm/ComponentsModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import React, { MouseEventHandler, useEffect, useRef } from "react";
import { useState } from "react";
import EditorCell from "components/cellTypes/EditorCell";
import { TableColumn } from "cdm/FolderModel";

const TextCell = (props: CellComponentProps) => {
  const { defaultCell } = props;
  const { cell, column, table, row } = defaultCell;
  const { tableState } = table.options.meta;

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

  const textCell = textRow[column.id]?.toString();
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
    dataActions.updateCell(
      row.index,
      column.columnDef as TableColumn,
      changedValue.trim(),
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings()
    );
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
    />
  );
};

export default TextCell;
