import { EditorCellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";

import React, { ChangeEventHandler, KeyboardEventHandler, useRef } from "react";
import { useState } from "react";
import { MarkdownEditor } from "../Editor/MarkdownEditor";

const EditorCell = (props: EditorCellComponentProps) => {
  const { defaultCell, cellValue, setCellValue, setDirtyCell } = props;
  const { row, column, table } = defaultCell;
  /** Ref to cell container */
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

  const [triggerSuggestions, setTriggerSuggestions] = useState(false);
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
      changedValue,
      columns,
      ddbbConfig
    );
  };

  const handleEnter = () => {
    // Close input on enter
    editableMdRef.current.blur();
  };

  const handleOnBlur = () => {
    setCellValue(editorValue);
    setDirtyCell(false);
  };

  return (
    <>
      {/* <input
        value={(editorValue && editorValue.toString()) || ""}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        onBlur={handleOnBlur}
        ref={editableMdRef}
        autoFocus
      />
      {triggerSuggestions && <VirtualizedSuggestionList />} */}
      <MarkdownEditor
        ref={editableMdRef}
        value={(editorValue && editorValue.toString()) || ""}
        onEnter={handleEnter}
        onEscape={() => console.log("onEscape")}
        onSubmit={() => console.log("onSubmit")}
        onBlur={handleOnBlur}
        onChange={handleOnChange}
        view={table.options.meta.view}
      />
    </>
  );
};

export default EditorCell;
