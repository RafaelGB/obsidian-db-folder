import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { LOGGER } from "services/Logger";

const TextCell = (props: CellComponentProps) => {
  const { defaultCell } = props;
  const { cell, row, column, table } = defaultCell;
  /** Ref to cell container */
  const containerCellRef = useRef<HTMLDivElement>();
  const editableMdRef = useRef<HTMLInputElement>();
  /** Columns information */
  const columns = table.options.meta.tableState.columns(
    (state) => state.columns
  );
  const dataActions = table.options.meta.tableState.data(
    (state) => state.actions
  );
  const ddbbConfig = table.options.meta.tableState.configState(
    (state) => state.ddbbConfig
  );

  const [cellValue, setCellValue] = useState(cell.getValue());
  const [dirtyCell, setDirtyCell] = useState(false);

  const [editNoteTimeout, setEditNoteTimeout] = useState(null);

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
      renderMarkdown(
        defaultCell,
        cellValue?.toString(),
        containerCellRef.current,
        5
      );
    }
  }, [dirtyCell]);

  /**
   * Focus input when cell is clicked
   */
  useEffect(() => {
    if (editableMdRef.current) {
      LOGGER.debug(
        `useEffect hooked with editableMdRef. current value & dirtyCell: ${cellValue} ${dirtyCell}`
      );
      editableMdRef.current.focus();
    }
  }, [editableMdRef]);

  const handleEditableOnclick = (event: any) => {
    setDirtyCell(true);
  };

  // onChange handler
  const handleOnChange = (event: any) => {
    setDirtyCell(true);
    // cancelling previous timeouts
    if (editNoteTimeout) {
      clearTimeout(editNoteTimeout);
    }
    // first update the input text as user type
    setCellValue(event.target.value);
    // initialize a setimeout by wrapping in our editNoteTimeout so that we can clear it out using clearTimeout
    setEditNoteTimeout(
      setTimeout(() => {
        onChange(event.target.value);
        // timeout until event is triggered after user has stopped typing
      }, 1500)
    );
  };

  function onChange(changedValue: string) {
    dataActions.updateCell(
      row.index,
      column.columnDef as TableColumn,
      changedValue,
      columns,
      ddbbConfig
    );
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };

  const handleOnBlur = (event: any) => {
    setDirtyCell(false);
  };

  return dirtyCell ? (
    <input
      value={(cellValue && cellValue.toString()) || ""}
      onChange={handleOnChange}
      onKeyDown={handleKeyDown}
      onBlur={handleOnBlur}
      ref={editableMdRef}
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
