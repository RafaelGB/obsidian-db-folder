import React, { useEffect, useRef, useState } from "react";
import { Cell } from "react-table";
import { ActionTypes, DataTypes } from "helpers/Constants";
import { c } from "helpers/StylesHelper";

import { LOGGER } from "services/Logger";
import NoteInfo from "services/NoteInfo";
import { TableColumn, TableDataType } from "cdm/FolderModel";
import PopperSelectPortal from "components/portals/PopperSelectPortal";
import { CellContext } from "components/contexts/CellContext";
import CalendarPortal from "components/portals/CalendarPortal";
import CalendarTimePortal from "components/portals/CalendarTimePortal";
import { renderMarkdown } from "components/markdown/MarkdownRenderer";
import { CheckboxCell } from "components/Checkbox";
import TagsPortal from "components/portals/TagsPortal";
import { DataviewService } from "services/DataviewService";

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
  const taskRef = useRef<HTMLDivElement>();
  /** state of cell value */
  const [contextValue, setContextValue] = useState({
    value: initialValue,
    update: false,
  });
  /** state for keeping the timeout to trigger the editior */
  const [editNoteTimeout, setEditNoteTimeout] = useState(null);
  const [dirtyCell, setDirtyCell] = useState(false);

  const tableData = (cellProperties as any)
    .tableData as unknown as TableDataType;
  const column = cellProperties.column as unknown as TableColumn;
  /** states for selector option  */
  LOGGER.debug(
    `<=> Cell.rendering dataType: ${dataType}. value: ${contextValue.value}`
  );
  // set contextValue when cell is loaded
  useEffect(() => {
    LOGGER.debug(
      `default useEffect. dataType:${dataType} - value: ${contextValue.value} initialValue: ${initialValue}`
    );
    switch (dataType) {
      case DataTypes.TASK:
        //TODO - this is a hack. find why is layout effect called twice
        taskRef.current.innerHTML = "";
        DataviewService.getDataviewAPI().taskList(
          contextValue.value,
          false,
          taskRef.current,
          tableData.view,
          tableData.view.file.path
        );
        break;
      case DataTypes.MARKDOWN:
        containerCellRef.current.innerHTML = "";
        renderMarkdown(cellProperties, initialValue, containerCellRef.current);
        break;
      default:
      // do nothing
    }
  });

  useEffect(() => {
    if (editableMdRef.current) {
      LOGGER.debug(
        `useEffect hooked with editableMdRef. current value & dirtyCell: ${contextValue.value} ${dirtyCell}`
      );
      editableMdRef.current.focus();
    }
  }, [editableMdRef, dirtyCell]);

  useEffect(() => {
    if (
      !dirtyCell &&
      containerCellRef.current !== undefined &&
      dataType !== DataTypes.MARKDOWN
    ) {
      LOGGER.debug(
        `useEffect hooked with dirtyCell. Value:${contextValue.value}`
      );
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

  const handleOnBlur = (event: any) => {
    setDirtyCell(false);
  };

  const handleEditableOnclick = (event: any) => {
    setDirtyCell(true);
  };

  // onChange handler
  const handleOnChange = (event: any) => {
    setDirtyCell(true);
    // cancelling previous timeouts
    if (editNoteTimeout) {
      clearTimeout(editNoteTimeout);
    }
    // first update the input text as user type
    setContextValue({ value: event.target.value, update: true });
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
            onBlur={handleOnBlur}
            className="data-input"
            ref={editableMdRef}
          />
        ) : (
          <span
            ref={containerCellRef}
            className={"data-input"}
            onClick={handleEditableOnclick}
          />
        );

      /** Number option */
      case DataTypes.NUMBER:
        return dirtyCell ? (
          <input
            value={(contextValue.value && contextValue.value.toString()) || ""}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            onBlur={handleOnBlur}
            className="data-input text-align-right"
          />
        ) : (
          <span
            className="data-input text-align-right"
            onClick={handleEditableOnclick}
          >
            {(contextValue.value && contextValue.value.toString()) || ""}
          </span>
        );

      /** Markdown option */
      case DataTypes.MARKDOWN:
        if (initialValue !== contextValue.value.toString()) {
          setContextValue({
            value: initialValue,
            update: false,
          });
        }
        return (
          <span ref={containerCellRef} className={`${c("md_cell")}`}></span>
        );

      /** Calendar option */
      case DataTypes.CALENDAR:
        return (
          <CalendarPortal
            intialState={tableData}
            column={column}
            cellProperties={cellProperties}
          />
        );

      /** Calendar with time option */
      case DataTypes.CALENDAR_TIME:
        return (
          <CalendarTimePortal
            intialState={tableData}
            column={column}
            cellProperties={cellProperties}
          />
        );

      /** Selector option */
      case DataTypes.SELECT:
        return (
          <CellContext.Provider value={{ contextValue, setContextValue }}>
            <PopperSelectPortal
              dispatch={dataDispatch}
              row={cellProperties.row}
              column={column}
              columns={columns}
              note={note}
              intialState={tableData}
            />
          </CellContext.Provider>
        );
      /** Tags option */
      case DataTypes.TAGS:
        return (
          <CellContext.Provider value={{ contextValue, setContextValue }}>
            <TagsPortal
              intialState={tableData}
              column={column}
              columns={columns}
              dispatch={dataDispatch}
              cellProperties={cellProperties}
            />
          </CellContext.Provider>
        );

      case DataTypes.TASK:
        return <div ref={taskRef} className="data-input"></div>;

      case DataTypes.CHECKBOX:
        return (
          <CellContext.Provider value={{ contextValue, setContextValue }}>
            <CheckboxCell
              intialState={tableData}
              column={column}
              cellProperties={cellProperties}
            />
          </CellContext.Provider>
        );
      /** Default option */
      default:
        LOGGER.warn(`Unknown data type: ${dataType}`);
        return <span></span>;
    }
  }
  return getCellElement();
}
