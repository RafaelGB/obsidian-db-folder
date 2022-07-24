import { ActionTypes } from "helpers/Constants";
import React, { useState } from "react";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import NoteInfo from "services/NoteInfo";
import { Portal } from "@mui/material";
import { c } from "helpers/StylesHelper";
import { CalendarProps } from "cdm/ComponentsModel";
import { TableDataType } from "cdm/FolderModel";

const CalendarPortal = (calendarProps: CalendarProps) => {
  const { column, cellProperties, intialState } = calendarProps;
  const { row, table } = cellProperties;
  const dataDispatch = (table.options.meta as TableDataType).dispatch;
  /** state of cell value */
  const [showDatePicker, setShowDatePicker] = useState(false);
  /** Note info of current Cell */
  const note: NoteInfo = row.original.__note__;
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
      row: row,
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
      placeholderText="Pick a date..."
    />
  ) : (
    <span className={`${c("calendar")}`} onClick={handleOnClick}>
      {DateTime.isDateTime(calendarState)
        ? (calendarState as unknown as DateTime).toFormat("yyyy-MM-dd")
        : null}
    </span>
  );
};

export default CalendarPortal;
