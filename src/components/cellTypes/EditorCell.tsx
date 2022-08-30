import { EditorCellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";

import React, { ChangeEventHandler, useCallback, useRef } from "react";
import { useState } from "react";
import { MarkdownEditor } from "components/cellTypes/Editor/MarkdownEditor";

const EditorCell = (props: EditorCellComponentProps) => {
  const { defaultCell, setDirtyCell } = props;
  const { cell, row, column, table } = defaultCell;
  /** Ref to cell container */
  const editableMdRef = useRef<HTMLInputElement>();
  /** Columns information */
  const columnsInfo = table.options.meta.tableState.columns(
    (state) => state.info
  );
  const dataActions = table.options.meta.tableState.data(
    (state) => state.actions
  );
  const configInfo = table.options.meta.tableState.configState(
    (state) => state.info
  );

  const [editorValue, setEditorValue] = useState(cell.getValue());

  // onChange handler
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;

    // first update the input text as user type
    setEditorValue(value);
  };

  const persistChange = (changedValue: string) => {
    dataActions.updateCell(
      row.index,
      column.columnDef as TableColumn,
      changedValue.trim(),
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings()
    );
  };

  /** Call onBlur */
  const handleEnter = () => {
    editableMdRef.current.blur();
  };

  /**
   * Close editor undoing any changes realised
   */
  const handleOnEscape = useCallback(() => {
    setDirtyCell(false);
    persistChange(cell.getValue()?.toString());
  }, []);

  /**
   * Save changes and close editor
   */
  const handleOnBlur = () => {
    setDirtyCell(false);
    persistChange(editorValue?.toString());
  };

  return (
    <>
      <MarkdownEditor
        ref={editableMdRef}
        value={editorValue?.toString()}
        onEnter={handleEnter}
        onEscape={handleOnEscape}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        view={table.options.meta.view}
        autoFocus
      />
    </>
  );
};

export default EditorCell;
