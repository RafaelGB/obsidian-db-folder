import { CellComponentProps } from "cdm/ComponentsModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import React, { MouseEventHandler, useEffect, useRef } from "react";
import { useState } from "react";
import EditorCell from "components/cellTypes/EditorCell";

const TextCell = (props: CellComponentProps) => {
  const { defaultCell } = props;
  const { column, table, row } = defaultCell;
  const { tableState } = table.options.meta;
  const textRow = tableState.data((state) => state.rows[row.index]);

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
      console.log("rendering markdown");
      renderMarkdown(
        defaultCell,
        textRow[column.id]?.toString(),
        containerCellRef.current,
        5
      );
    }
  }, [dirtyCell]);

  const handleEditableOnclick: MouseEventHandler<HTMLSpanElement> = () => {
    setDirtyCell(true);
  };

  return dirtyCell ? (
    <EditorCell defaultCell={defaultCell} setDirtyCell={setDirtyCell} />
  ) : (
    <span
      ref={containerCellRef}
      onClick={handleEditableOnclick}
      style={{ width: column.getSize() }}
    />
  );
};

export default TextCell;
