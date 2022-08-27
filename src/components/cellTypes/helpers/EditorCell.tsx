import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { EditorCellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { suggesterFilesInFunctionOf } from "components/obsidianArq/NoteSuggester";
import { StyleVariables } from "helpers/Constants";
import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useMemo,
} from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";
import { LOGGER } from "services/Logger";

const EditorCell = (props: EditorCellComponentProps) => {
  const { defaultCell, cellValue, setCellValue, setDirtyCell } = props;
  const { row, column, table } = defaultCell;
  /** Ref to cell container */
  const [editableMdRef, setEditableMdRef] = useState(null);
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

  // Selector reference state
  const [triggerSuggestions, setTriggerSuggestions] = useState(false);
  const [domReady, setDomReady] = useState(false);
  // Selector popper state
  const [suggesterPop, setSuggesterPop] = useState(null);
  const { styles, attributes } = usePopper(editableMdRef, suggesterPop);

  const linkSuggestions = useMemo(
    () =>
      app.metadataCache
        .getLinkSuggestions()
        .filter((s) => s.file !== undefined),
    []
  );

  const [editorValue, setEditorValue] = useState(cellValue);
  const [editNoteTimeout, setEditNoteTimeout] = useState(null);

  React.useEffect(() => {
    if (!domReady) {
      setDomReady(true);
    }
  });
  // onChange handler
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value } = event.target;
    // cancelling previous timeouts
    if (editNoteTimeout) {
      clearTimeout(editNoteTimeout);
    }
    if (suggesterFilesInFunctionOf(value)) {
      setTriggerSuggestions(true);
    }
    // first update the input text as user type
    setEditorValue(event.target.value);
    // initialize a setimeout by wrapping in our editNoteTimeout so that we can clear it out using clearTimeout
    setEditNoteTimeout(
      setTimeout(() => {
        onChange(event.target.value);
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

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      (event.target as any).blur();
    }
  };

  const handleOnBlur = () => {
    setCellValue(editorValue);
    setTriggerSuggestions(false);
    setDirtyCell(false);
  };

  const handleSelectSuggestion = (event: any) => {
    console.log(event);
  };
  const SuggesterPopper = () => {
    return (
      <div
        ref={setSuggesterPop}
        {...attributes.popper}
        style={{
          ...styles.popper,
          zIndex: 4,
          minWidth: 200,
          maxWidth: 320,
          padding: "0.75rem",
          background: StyleVariables.BACKGROUND_SECONDARY,
        }}
      >
        <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
          <InputLabel shrink htmlFor="select-multiple-native">
            Native
          </InputLabel>
          <Select
            multiple
            native
            value={linkSuggestions[0].file.basename}
            onChange={handleSelectSuggestion}
            inputProps={{
              id: "select-multiple-native",
            }}
          >
            {linkSuggestions.map((suggestion) => {
              console.log(suggestion);
              return (
                <option key={suggestion.file.basename} value={suggestion.path}>
                  {suggestion.file.basename}
                </option>
              );
            })}
          </Select>
        </FormControl>
      </div>
    );
  };
  return (
    <>
      <input
        value={(editorValue && editorValue.toString()) || ""}
        onChange={handleOnChange}
        onKeyDown={handleKeyDown}
        onBlur={handleOnBlur}
        ref={setEditableMdRef}
        autoFocus
      />
      {triggerSuggestions &&
        domReady &&
        ReactDOM.createPortal(
          SuggesterPopper(),
          activeDocument.getElementById("popper-container")
        )}
    </>
  );
};

export default EditorCell;
