import { CellContext } from "components/contexts/CellContext";
import { ActionTypes } from "helpers/Constants";
import React, { useContext, useState } from "react";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import NoteInfo from "services/NoteInfo";
import { Portal } from "@material-ui/core";
import { CalendarProps } from "cdm/DatabaseModel";

const CalendarTimePortal = (calendarProps: CalendarProps) => {
  const { column, cellProperties } = calendarProps;
  const dataDispatch = (cellProperties as any).dataDispatch;
  // Selector reference state

  // Selector popper state
  /** state of cell value */
  const { contextValue, setContextValue } = useContext(CellContext);

  /** Note info of current Cell */
  const note: NoteInfo = (cellProperties.row.original as any).note;
  const [calendarState, setCalendarState] = useState(
    DateTime.isDateTime(contextValue.value)
      ? contextValue.value.toJSDate()
      : null
  );

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

    setCalendarState(date);
    setContextValue({
      value: newValue,
      update: true,
    });
  }

  const CalendarContainer = (containerProps: any) => {
    const el = document.getElementById("popper-container");
    return <Portal container={el}>{containerProps.children}</Portal>;
  };

  return column.isMetadata ? (
    <span className="data-input calendar-time">
      {(contextValue.value as DateTime).toFormat("yyyy-MM-dd h:mm a")}
    </span>
  ) : (
    <div className="data-input calendar-time">
      <DatePicker
        dateFormat="yyyy-MM-dd h:mm aa"
        selected={calendarState}
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
