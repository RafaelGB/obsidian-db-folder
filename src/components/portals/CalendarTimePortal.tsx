import React, { useState } from "react";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import { Portal } from "@mui/material";
import { CalendarProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";

const CalendarTimePortal = (calendarTimeProps: CalendarProps) => {
  const { defaultCell } = calendarTimeProps;
  const { row, table, column } = defaultCell;
  const tableColumn = column.columnDef as TableColumn;
  const [rows, dataActions] = table.options.meta.tableState.data((state) => [
    state.rows,
    state.actions,
  ]);
  const columns = table.options.meta.tableState.columns(
    (state) => state.columns
  );
  const ddbbConfig = table.options.meta.tableState.configState(
    (state) => state.ddbbConfig
  );

  // Calendar state
  const calendarTimeState = rows[row.index][tableColumn.key];
  /** state of cell value */
  const [showDatePicker, setShowDatePicker] = useState(false);

  function handleSpanOnClick(event: any) {
    event.preventDefault();
    setShowDatePicker(true);
  }

  function handleCalendarChange(date: Date) {
    dataActions.updateCell(
      row.index,
      tableColumn,
      DateTime.fromJSDate(date).toISO(),
      columns,
      ddbbConfig
    );
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
