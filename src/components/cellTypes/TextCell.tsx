import { CellComponentProps } from "cdm/ComponentsModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import React, { MouseEventHandler, useEffect, useRef } from "react";
import { useState } from "react";
import EditorCell from "components/cellTypes/EditorCell";
import { TableColumn } from "cdm/FolderModel";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { ParseService } from "services/ParseService";
import { InputType } from "helpers/Constants";

const TextCell = (props: CellComponentProps) => {
  const { defaultCell } = props;
  const { column, table, row } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const textRow = tableState.data((state) => state.rows[row.index]);

  const configInfo = tableState.configState((state) => state.info);

  const columnsInfo = tableState.columns((state) => state.info);

  const dataActions = tableState.data((state) => state.actions);

  const textCell = tableState.data(
    (state) =>
      ParseService.parseRowToCell(
        state.rows[row.index],
        tableColumn,
        InputType.TEXT,
        configInfo.getLocalSettings()
      ) as string
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
  }, [dirtyCell, textCell]);

  const handleEditableOnclick: MouseEventHandler<HTMLSpanElement> = () => {
    setDirtyCell(true);
  };

  const persistChange = async (changedValue: string) => {
    changedValue = changedValue.trim();
    if (changedValue !== undefined && changedValue !== textCell) {
      const newCell = ParseService.parseRowToLiteral(
        textRow,
        tableColumn,
        changedValue
      );

      await dataActions.updateCell(
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

export default TextCell;
