import { EditorCellComponentProps } from "cdm/ComponentsModel";

import React, { ChangeEventHandler, useCallback, useRef } from "react";
import { useState } from "react";
import { MarkdownEditor } from "components/cellTypes/Editor/MarkdownEditor";

const EditorCell = (props: EditorCellComponentProps) => {
  const { defaultCell, persistChange, textCell } = props;
  const { table } = defaultCell;
  /** Ref to cell container */
  const editableMdRef = useRef<HTMLInputElement>();
  /** Columns information */

  const [editorValue, setEditorValue] = useState(textCell);

  // onChange handler
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    setEditorValue(value);
  };

  /** Call onBlur */
  const handleEnter = () => {
    editableMdRef.current.blur();
  };

  /**
   * Close editor undoing any changes realised
   */
  const handleOnEscape = useCallback(() => {
    persistChange(textCell);
  }, []);

  /**
   * Save changes and close editor
   */
  const handleOnBlur = () => {
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
