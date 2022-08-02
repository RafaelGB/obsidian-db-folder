import { ActionTypes } from "helpers/Constants";
import React, { useState } from "react";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import NoteInfo from "services/NoteInfo";
import { Portal } from "@mui/material";
import { c } from "helpers/StylesHelper";
import { CalendarProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";

const CalendarPortal = (calendarProps: CalendarProps) => {
  const { column, defaultCell } = calendarProps;
  const { row, table } = defaultCell;
  const tableColumn = column.columnDef as TableColumn;
  const rows = table.options.meta.tableState.data((state) => state.rows);
  const dataDispatch = (action: any) =>
    console.log(`TODO migrate dispatch to table${action.type}`);
  /** state of cell value */
  const [showDatePicker, setShowDatePicker] = useState(false);
  /** Note info of current Cell */
  const note: NoteInfo = row.original.__note__;
  const [calendarState, setCalendarState] = useState(
    rows[row.index][tableColumn.key]
  );

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
      value: newValue.toFormat("yyyy-MM-dd"),
      row: row,
      columnId: column.id,
      state: table.options.meta.tableState,
    });
    setCalendarState(newValue);
    setShowDatePicker(false);
  }

  const CalendarContainer = (containerProps: any) => {
    const el = activeDocument.getElementById("popper-container");
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
    <span
      className={`${c("calendar")}`}
      onClick={handleSpanOnClick}
      style={{ width: column.getSize() }}
    >
      {DateTime.isDateTime(calendarState)
        ? (calendarState as unknown as DateTime).toFormat("yyyy-MM-dd")
        : null}
    </span>
  );
};

export default CalendarPortal;
