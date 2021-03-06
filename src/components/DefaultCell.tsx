import React, { useEffect, useRef, useState } from "react";
import { Cell } from "@tanstack/react-table";
import { ActionTypes, DataTypes } from "helpers/Constants";
import { c } from "helpers/StylesHelper";

import { LOGGER } from "services/Logger";
import NoteInfo from "services/NoteInfo";
import { RowDataType, TableColumn, TableDataType } from "cdm/FolderModel";
import PopperSelectPortal from "components/portals/PopperSelectPortal";
import { CellContext } from "components/contexts/CellContext";
import CalendarPortal from "components/portals/CalendarPortal";
import CalendarTimePortal from "components/portals/CalendarTimePortal";
import { renderMarkdown } from "components/markdown/MarkdownRenderer";
import { CheckboxCell } from "components/Checkbox";
import TagsPortal from "components/portals/TagsPortal";
import { DataviewService } from "services/DataviewService";
import { CellProps } from "cdm/CellModel";

export default function DefaultCell(cellProperties: CellProps) {
  const { cell, column, row, table } = cellProperties;
  const dataDispatch = (table.options.meta as TableDataType).dispatch;
  /** Initial state of cell */
  const cellValue = cell.getValue();
  /** Columns information */
  const columns = (table.options.meta as TableDataType).columns;
  /** Type of cell */
  const dataType = (column.columnDef as TableColumn).dataType;
  /** Note info of current Cell */
  const note: NoteInfo = (row.original as RowDataType).__note__;
  /** Ref to cell container */
  const containerCellRef = useRef<HTMLDivElement>();
  const editableMdRef = useRef<HTMLInputElement>();
  const taskRef = useRef<HTMLDivElement>();
  /** state of cell value */
  const [contextValue, setContextValue] = useState({
    value: cellValue,
    update: false,
  });
  /** state for keeping the timeout to trigger the editior */
  const [editNoteTimeout, setEditNoteTimeout] = useState(null);
  const [dirtyCell, setDirtyCell] = useState(false);

  const tableData = table.options.meta as TableDataType;
  /** states for selector option  */
  LOGGER.debug(
    `<=> Cell.rendering dataType: ${dataType}. value: ${contextValue.value}`
  );
  // set contextValue when cell is loaded
  useEffect(() => {
    LOGGER.debug(
      `default useEffect. dataType:${dataType} - value: ${contextValue.value} cellValue: ${cellValue}`
    );
    if (dirtyCell) {
      // End useEffect
      return;
    }
    switch (dataType) {
      case DataTypes.TASK:
        // Check if there are tasks in the cell
        if (contextValue.value === "") break;
        taskRef.current.innerHTML = "";
        if ((column.columnDef as TableColumn).config.task_hide_completed) {
          contextValue.value = contextValue.value.where(
            (t: any) => !t.completed
          );
        }
        DataviewService.getDataviewAPI().taskList(
          contextValue.value,
          false,
          taskRef.current,
          tableData.view,
          tableData.view.file.path
        );

        break;
      case DataTypes.MARKDOWN:
      case DataTypes.TEXT:
        if (containerCellRef.current !== null) {
          containerCellRef.current.innerHTML = "";
          renderMarkdown(
            cellProperties,
            cellValue,
            containerCellRef.current,
            5
          );
        }
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
      renderMarkdown(
        cellProperties,
        contextValue.value,
        containerCellRef.current,
        5
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
      key: (column.columnDef as TableColumn).key,
      value: changedValue,
      row: row,
      columnId: (column.columnDef as TableColumn).id,
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
            ref={editableMdRef}
          />
        ) : (
          <span ref={containerCellRef} onClick={handleEditableOnclick} />
        );

      /** Number option */
      case DataTypes.NUMBER:
        return dirtyCell ? (
          <input
            value={(contextValue.value && contextValue.value.toString()) || ""}
            onChange={handleOnChange}
            onKeyDown={handleKeyDown}
            onBlur={handleOnBlur}
            className="text-align-right"
          />
        ) : (
          <span className="text-align-right" onClick={handleEditableOnclick}>
            {(contextValue.value && contextValue.value.toString()) || ""}
          </span>
        );

      /** Markdown option */
      case DataTypes.MARKDOWN:
        if (cellValue !== contextValue.value.toString()) {
          setContextValue({
            value: cellValue,
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
            column={column.columnDef as TableColumn}
            cellProperties={cellProperties}
          />
        );

      /** Calendar with time option */
      case DataTypes.CALENDAR_TIME:
        return (
          <CalendarTimePortal
            intialState={tableData}
            column={column.columnDef as TableColumn}
            cellProperties={cellProperties}
          />
        );

      /** Selector option */
      case DataTypes.SELECT:
        return (
          <CellContext.Provider value={{ contextValue, setContextValue }}>
            <PopperSelectPortal
              dispatch={dataDispatch}
              row={row}
              column={column.columnDef as TableColumn}
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
              column={column.columnDef as TableColumn}
              columns={columns}
              dispatch={dataDispatch}
              cellProperties={cellProperties}
            />
          </CellContext.Provider>
        );

      case DataTypes.TASK:
        if ((column.columnDef as TableColumn).config.task_hide_completed) {
        }
        return <div ref={taskRef}></div>;

      case DataTypes.CHECKBOX:
        return (
          <CellContext.Provider value={{ contextValue, setContextValue }}>
            <CheckboxCell
              intialState={tableData}
              column={column.columnDef as TableColumn}
              cellProperties={cellProperties}
            />
          </CellContext.Provider>
        );
      case DataTypes.NEW_COLUMN:
        // Do nothing
        break;
      /** Default option */
      default:
        LOGGER.warn(`Unknown data type: ${dataType}`);
    }
    return <span></span>;
  }
  return getCellElement();
}
