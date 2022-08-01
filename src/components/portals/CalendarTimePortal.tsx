import { ActionTypes } from "helpers/Constants";
import React, { useState } from "react";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import NoteInfo from "services/NoteInfo";
import { Portal } from "@mui/material";
import { CalendarProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";

const CalendarTimePortal = (calendarTimeProps: CalendarProps) => {
  const { column, cellProperties } = calendarTimeProps;
  const { row, table } = cellProperties;
  const tableColumn = column.columnDef as TableColumn;
  const dataDispatch = (action: any) =>
    console.log(`TODO migrate dispatch to table${action.type}`);
  const rows = table.options.meta.tableState.data((state) => state.rows);
  // Calendar state
  const [calendarTimeState, setCalendarTimeState] = useState(
    rows[row.index][tableColumn.key]
  );
  /** state of cell value */
  const [showDatePicker, setShowDatePicker] = useState(false);

  /** Note info of current Cell */
  const note: NoteInfo = row.original.__note__;

  function handleSpanOnClick(event: any) {
    event.preventDefault();
    setShowDatePicker(true);
  }

  function handleCalendarChange(date: Date) {
    const newValue = DateTime.fromJSDate(date);
    // save on disk
    dataDispatch({
      type: ActionTypes.UPDATE_CELL,
      file: note.getFile(),
      key: tableColumn.key,
      value: DateTime.fromJSDate(date).toISO(),
      row: row,
      columnId: column.id,
      state: table.options.meta.tableState,
    });

    setCalendarTimeState(newValue);
    setShowDatePicker(false);
  }

  const CalendarContainer = (containerProps: any) => {
    const el = activeDocument.getElementById("popper-container");
    return <Portal container={el}>{containerProps.children}</Portal>;
  };
  return showDatePicker &&
    (tableColumn.isMetadata === undefined || !tableColumn.isMetadata) ? (
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
        onBlur={() => setShowDatePicker(false)}
        timeFormat="HH:mm"
        timeCaption="time"
        showTimeSelect
        autoFocus
        placeholderText="Pick a moment..."
      />
    </div>
  ) : (
    <span
      className="calendar-time"
      onClick={handleSpanOnClick}
      style={{ width: column.getSize() }}
    >
      {DateTime.isDateTime(calendarTimeState)
        ? (calendarTimeState as DateTime).toFormat("yyyy-MM-dd h:mm a")
        : null}
    </span>
  );
};

export default CalendarTimePortal;
