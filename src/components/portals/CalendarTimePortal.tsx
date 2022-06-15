import { ActionTypes } from "helpers/Constants";
import React, { useState } from "react";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import NoteInfo from "services/NoteInfo";
import { Portal } from "@material-ui/core";
import { CalendarProps } from "cdm/ComponentsModel";

const CalendarTimePortal = (calendarTimeProps: CalendarProps) => {
  const { column, cellProperties, intialState } = calendarTimeProps;
  const { row } = cellProperties;
  const dataDispatch = (cellProperties as any).dataDispatch;
  // Calendar state
  const [calendarTimeState, setCalendarTimeState] = useState(
    intialState.view.rows[row.index][column.key]
  );
  // Selector popper state

  /** Note info of current Cell */
  const note: NoteInfo = (cellProperties.row.original as any).note;

  function handleCalendarChange(date: Date) {
    const newValue = DateTime.fromJSDate(date);
    // save on disk
    dataDispatch({
      type: ActionTypes.UPDATE_CELL,
      file: note.getFile(),
      key: column.key,
      value: DateTime.fromJSDate(date).toISO(),
      row: cellProperties.row,
      columnId: column.id,
    });

    setCalendarTimeState(newValue);
  }

  const CalendarContainer = (containerProps: any) => {
    const el = document.getElementById("popper-container");
    return <Portal container={el}>{containerProps.children}</Portal>;
  };

  return column.isMetadata ? (
    <span className="calendar-time">
      {DateTime.isDateTime(calendarTimeState)
        ? (calendarTimeState as DateTime).toFormat("yyyy-MM-dd h:mm a")
        : "Invalid metadata date!"}
    </span>
  ) : (
    <div className="calendar-time">
      <DatePicker
        dateFormat="yyyy-MM-dd h:mm aa"
        selected={
          DateTime.isDateTime(calendarTimeState)
            ? (calendarTimeState as unknown as DateTime).toJSDate()
            : null
        }
        onChange={handleCalendarChange}
        popperContainer={CalendarContainer}
        timeFormat="HH:mm"
        timeCaption="time"
        showTimeSelect
        placeholderText="Pick a moment..."
      />
    </div>
  );
};

export default CalendarTimePortal;
