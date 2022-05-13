import { TableColumn, TableDataType } from "cdm/FolderModel";
import { CellContext } from "components/contexts/CellContext";
import { ActionTypes, DataTypes, StyleVariables } from "helpers/Constants";
import React, { useContext, useState } from "react";
import Calendar from "react-calendar";
import ReactDOM from "react-dom";
import { DateTime } from "luxon";
import { usePopper } from "react-popper";
import { Cell } from "react-table";
import NoteInfo from "services/NoteInfo";
import { DataviewService } from "services/DataviewService";

type CalendarProps = {
  intialState: TableDataType;
  column: TableColumn;
  cellProperties: Cell;
};
const CalendarPortal = (calendarProps: CalendarProps) => {
  const { column, cellProperties } = calendarProps;
  const dataDispatch = (cellProperties as any).dataDispatch;
  const [showCalendar, setShowCalendar] = useState(false);
  // Selector reference state
  const [calendarRef, setCalendarRef] = useState(null);
  // Selector popper state
  const [selectPop, setSelectPop] = useState(null);
  const { styles, attributes } = usePopper(calendarRef, selectPop);
  /** state of cell value */
  const { contextValue, setContextValue } = useContext(CellContext);

  /** Note info of current Cell */
  const note: NoteInfo = (cellProperties.row.original as any).note;
  const [calendarState, setCalendarState] = useState(
    (
      DataviewService.parseLiteral(
        cellProperties.value,
        DataTypes.CALENDAR
      ) as DateTime
    ).toJSDate()
  );

  function handleCalendarChange(date: Date) {
    const newValue = DateTime.fromJSDate(date);
    // save on disk
    dataDispatch({
      type: ActionTypes.UPDATE_CELL,
      file: note.getFile(),
      key: (cellProperties.column as any).key,
      value: DateTime.fromJSDate(date).toFormat("yyyy-MM-dd"),
      row: cellProperties.row,
      columnId: (cellProperties.column as any).id,
    });
    setCalendarState(date);
    setShowCalendar(false);
    setContextValue({
      value: newValue,
      update: true,
    });
  }

  function handlerOnClick(e: any) {
    if (!column.isMetadata) {
      const portalActive = document.getElementById("unique-calendar-portal");
      if (!showCalendar && portalActive !== null) {
        // Hacky way to trigger focus event on opened calendar
        // react-calendar has a bug where it doesn't trigger focus event
        portalActive.setAttribute("tabindex", "-1");
        portalActive.focus();
        portalActive.blur();
      }
      setShowCalendar(!showCalendar);
    }
  }

  function displayCalendar() {
    return (
      <div
        className="menu"
        ref={setSelectPop}
        {...attributes.popper}
        style={{
          ...styles.popper,
          zIndex: 4,
          minWidth: 200,
          maxWidth: 320,
          padding: "0.5rem",
          background: StyleVariables.BACKGROUND_SECONDARY,
        }}
        onMouseLeave={() => setShowCalendar(false)}
        onBlur={() => setShowCalendar(false)}
        id={"unique-calendar-portal"}
      >
        <Calendar onChange={handleCalendarChange} value={calendarState} />
      </div>
    );
  }

  return (
    <>
      <div
        className="data-input calendar"
        ref={setCalendarRef}
        onClick={handlerOnClick}
      >
        <span>
          {DataviewService.parseLiteral(contextValue.value, DataTypes.TEXT)}
        </span>
      </div>
      {showCalendar &&
        ReactDOM.createPortal(
          displayCalendar(),
          document.getElementById("popper-container")
        )}
    </>
  );
};
export default CalendarPortal;
