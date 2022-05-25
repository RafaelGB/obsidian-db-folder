import { ActionTypes, DataTypes } from "helpers/Constants";
import React, { useEffect, useRef, useState } from "react";
import { LOGGER } from "services/Logger";
import { Cell } from "react-table";
import NoteInfo from "services/NoteInfo";
import PopperSelectPortal from "components/portals/PopperSelectPortal";
import { CellContext } from "components/contexts/CellContext";
import { c } from "helpers/StylesHelper";
import CalendarPortal from "./portals/CalendarPortal";
import { TableColumn } from "cdm/FolderModel";
import CalendarTimePortal from "components/portals/CalendarTimePortal";
import { renderMarkdown } from "components/markdown/MarkdownRenderer";

export default function DefaultCell(cellProperties: Cell) {
  const dataDispatch = (cellProperties as any).dataDispatch;
  /** Initial state of cell */
  const initialValue = cellProperties.value;
  /** Columns information */
  const columns = (cellProperties as any).columns;
  /** Type of cell */
  const dataType = (cellProperties.column as any).dataType;
  /** Note info of current Cell */
  const note: NoteInfo = (cellProperties.row.original as any).note;
  /** Ref to cell container */
  const containerCellRef = useRef<HTMLDivElement>();
  const editableMdRef = useRef<HTMLInputElement>();
  /** state of cell value */
  const [contextValue, setContextValue] = useState({
    value: initialValue,
    update: false,
  });
  /** state for keeping the timeout to trigger the editior */
  const [editNoteTimeout, setEditNoteTimeout] = useState(null);
  const [dirtyCell, setDirtyCell] = useState(false);
  /** states for selector option  */
  LOGGER.debug(
    `<=> Cell.rendering dataType: ${dataType}. value: ${contextValue.value}`
  );
  // set contextValue when cell is loaded
  useEffect(() => {
    if (!dirtyCell && initialValue !== contextValue.value) {
      setContextValue({
        value: initialValue,
        update: false,
      });
    }
  }, []);

  useEffect(() => {
    if (editableMdRef.current) {
      editableMdRef.current.focus();
    }
  }, [editableMdRef, dirtyCell]);

  useEffect(() => {
    if (!dirtyCell && containerCellRef.current) {
      renderMarkdown;
      //TODO - this is a hack. find why is layout effect called twice
      containerCellRef.current.innerHTML = "";
      renderMarkdown(
        cellProperties,
        contextValue.value,
        containerCellRef.current
      );
    }
  }, [dirtyCell]);

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };

  const handleEditableOnclick = (event: any) => {
    setDirtyCell(true);
  };

  const handlerEditableOnBlur = (event: any) => {
    setContextValue((event) => ({ value: event.value, update: true }));
    setDirtyCell(false);
  };

  // onChange handler
  const handleOnChange = (event: any) => {
    // cancelling previous timeouts
    if (editNoteTimeout) {
      clearTimeout(editNoteTimeout);
    }
    // first update the input text as user type
    setContextValue({ value: event.target.value, update: false });
    setDirtyCell(true);
    // initialize a setimeout by wrapping in our editNoteTimeout so that we can clear it out using clearTimeout
    setEditNoteTimeout(
      setTimeout(() => {
        onChange(event.target.value);
        // timeout until event is triggered after user has stopped typing
      }, 1500)
    );
  };

  function onChange(changedValue: string) {
    // save on disk
    dataDispatch({
      type: ActionTypes.UPDATE_CELL,
      file: note.getFile(),
      key: (cellProperties.column as any).key,
      value: changedValue,
      row: cellProperties.row,
      columnId: (cellProperties.column as any).id,
    });
  }

  function getCellElement() {
    switch (dataType) {
      /** Plain text option */
      case DataTypes.TEXT:
        return dirtyCell ? (
          <input
            value={(contextValue.value && contextValue.value.toString()) || ""}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            onBlur={handlerEditableOnBlur}
            className={"data-input"}
            ref={editableMdRef}
          />
        ) : (
          <span
            ref={containerCellRef}
            className="data-input"
            onClick={handleEditableOnclick}
          >
            {(contextValue.value && contextValue.value.toString()) || ""}
          </span>
        );

      /** Number option */
      case DataTypes.NUMBER:
        return (
          <input
            value={(contextValue.value && contextValue.value.toString()) || ""}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            onBlur={handlerEditableOnBlur}
            className="data-input text-align-right"
          />
        );

      /** Markdown option */
      case DataTypes.MARKDOWN:
        return (
          <span ref={containerCellRef} className={`${c("md_cell")}`}></span>
        );

      /** Calendar with time option */
      case DataTypes.CALENDAR_TIME:
        return (
          <CellContext.Provider value={{ contextValue, setContextValue }}>
            <CalendarTimePortal
              intialState={(cellProperties as any).initialState}
              column={cellProperties.column as unknown as TableColumn}
              cellProperties={cellProperties}
            />
          </CellContext.Provider>
        );

      /** Selector option */
      case DataTypes.SELECT:
        return (
          <CellContext.Provider value={{ contextValue, setContextValue }}>
            <PopperSelectPortal
              dispatch={dataDispatch}
              row={cellProperties.row}
              column={cellProperties.column as unknown as TableColumn}
              columns={columns}
              note={note}
              state={(cellProperties as any).initialState}
            />
          </CellContext.Provider>
        );

      /** Calendar option */
      case DataTypes.CALENDAR:
        return (
          <CellContext.Provider value={{ contextValue, setContextValue }}>
            <CalendarPortal
              intialState={(cellProperties as any).initialState}
              column={cellProperties.column as unknown as TableColumn}
              cellProperties={cellProperties}
            />
          </CellContext.Provider>
        );

      case DataTypes.TASK:
        return (
          <span ref={containerCellRef} className={`${c("md_cell")}`}></span>
        );
      /** Default option */
      default:
        LOGGER.warn(`Unknown data type: ${dataType}`);
        return <span></span>;
    }
  }
  return getCellElement();
}
