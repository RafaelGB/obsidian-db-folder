import { ActionTypes } from "helpers/Constants";
import React, { useState } from "react";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import NoteInfo from "services/NoteInfo";
import { Portal } from "@material-ui/core";
import { c } from "helpers/StylesHelper";
import { CalendarProps } from "cdm/ComponentsModel";

const CalendarPortal = (calendarProps: CalendarProps) => {
  const { column, cellProperties, intialState } = calendarProps;
  const { row } = cellProperties;
  const dataDispatch = (cellProperties as any).dataDispatch;
  /** state of cell value */
  const [showDatePicker, setShowDatePicker] = useState(false);
  /** Note info of current Cell */
  const note: NoteInfo = (cellProperties.row.original as any).__note__;
  const [calendarState, setCalendarState] = useState(
    intialState.view.rows[row.index][column.key]
  );

  function handleOnClick(event: any) {
    event.preventDefault();
    setShowDatePicker(true);
  }

  function handleCalendarChange(date: Date) {
    const newValue = DateTime.fromJSDate(date);
    // save on disk
    dataDispatch({
      type: ActionTypes.UPDATE_CELL,
      file: note.getFile(),
      key: column.key,
      value: newValue.toFormat("yyyy-MM-dd"),
      row: cellProperties.row,
      columnId: column.id,
    });
    setCalendarState(newValue);
    setShowDatePicker(false);
  }

  const CalendarContainer = (containerProps: any) => {
    const el = document.getElementById("popper-container");
    return <Portal container={el}>{containerProps.children}</Portal>;
  };
  return showDatePicker ? (
    <DatePicker
      dateFormat="yyyy-MM-dd"
      selected={
        DateTime.isDateTime(calendarState)
          ? (calendarState as unknown as DateTime).toJSDate()
          : null
      }
      onChange={handleCalendarChange}
      popperContainer={CalendarContainer}
      onBlur={() => setShowDatePicker(false)}
      autoFocus
      className="data-input calendar"
    />
  ) : (
    <span className={`data-input ${c("calendar")}`} onClick={handleOnClick}>
      {DateTime.isDateTime(calendarState)
        ? (calendarState as unknown as DateTime).toFormat("yyyy-MM-dd")
        : "Pick a date..."}
    </span>
  );
};

export default CalendarPortal;
