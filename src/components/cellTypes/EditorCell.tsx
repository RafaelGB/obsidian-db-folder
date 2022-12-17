import { EditorCellComponentProps } from "cdm/ComponentsModel";

import React, { ChangeEventHandler, useCallback, useRef } from "react";
import { useState } from "react";
import { MarkdownEditor } from "components/cellTypes/Editor/MarkdownEditor";
import { c } from "helpers/StylesHelper";

const EditorCell = (props: EditorCellComponentProps) => {
  const { defaultCell, persistChange, textCell } = props;
  const { table } = defaultCell;
  /** Ref to cell container */
  const editableMdRef = useRef<HTMLTextAreaElement>();
  /** Columns information */

  const [editorValue, setEditorValue] = useState(textCell);

  // onChange handler
  const handleOnChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    const { value } = event.target;
    setEditorValue(value);
  };

  /** Call onBlur */
  const handleEnter = (e: KeyboardEvent) => {
    if (e.shiftKey) {
      e.preventDefault();
      //if shift + enter pressed insert <br>.
      const textArea = e.target as HTMLTextAreaElement;
      let s = textArea.value;
      let i = textArea.selectionStart;
      s = s.slice(0, i) + "</br>" + s.slice(textArea.selectionEnd);
      textArea.value = s;
      textArea.selectionStart = textArea.selectionEnd = i + 5;
    } else {
      editableMdRef.current.blur();
    }
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
        className={c("editor-cell")}
        autoFocus
      />
    </>
  );
};

export default EditorCell;
