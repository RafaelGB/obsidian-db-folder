import { EditorCellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";

import React, { ChangeEventHandler, useCallback, useRef } from "react";
import { useState } from "react";
import { MarkdownEditor } from "components/cellTypes/Editor/MarkdownEditor";

const EditorCell = (props: EditorCellComponentProps) => {
  const { defaultCell, cellValue, setCellValue, setDirtyCell } = props;
  const { row, column, table } = defaultCell;
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

  const [editorValue, setEditorValue] = useState(cellValue);
  const [editNoteTimeout, setEditNoteTimeout] = useState(null);

  // onChange handler
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    // cancelling previous timeouts
    if (editNoteTimeout) {
      clearTimeout(editNoteTimeout);
    }

    // first update the input text as user type
    setEditorValue(value);
    // initialize a setimeout by wrapping in our editNoteTimeout so that we can clear it out using clearTimeout
    setEditNoteTimeout(
      setTimeout(() => {
        onChange(value);
        // timeout until event is triggered after user has stopped typing
      }, 1500)
    );
  };

  const onChange = (changedValue: string) => {
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
    onChange(cellValue ? cellValue.toString() : "");
    setDirtyCell(false);
  }, []);

  /**
   * Save changes and close editor
   */
  const handleOnBlur = () => {
    setCellValue(editorValue);
    setDirtyCell(false);
  };

  return (
    <>
      <MarkdownEditor
        ref={editableMdRef}
        value={(editorValue && editorValue.toString()) || ""}
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
