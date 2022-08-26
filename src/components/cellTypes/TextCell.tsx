import { CellComponentProps } from "cdm/ComponentsModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import React, { MouseEventHandler, useEffect, useRef } from "react";
import { useState } from "react";
import { LOGGER } from "services/Logger";
import EditorCell from "components/cellTypes/helpers/EditorCell";

const TextCell = (props: CellComponentProps) => {
  const { defaultCell } = props;
  const { cell, column } = defaultCell;
  /** Ref to cell container */
  const containerCellRef = useRef<HTMLDivElement>();
  const editableMdRef = useRef<HTMLInputElement>();

  const [cellValue, setCellValue] = useState(cell.getValue());
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

  const handleEditableOnclick: MouseEventHandler<HTMLSpanElement> = () => {
    setDirtyCell(true);
  };

  return dirtyCell ? (
    <EditorCell
      defaultCell={defaultCell}
      cellValue={cellValue}
      setCellValue={setCellValue}
      setDirtyCell={setDirtyCell}
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
