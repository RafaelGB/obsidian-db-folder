import React, { useState } from "react";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import { Portal } from "@mui/material";
import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";

const CalendarTimePortal = (calendarTimeProps: CellComponentProps) => {
  const { defaultCell } = calendarTimeProps;
  const { row, table, column } = defaultCell;
  const tableColumn = column.columnDef as TableColumn;
  const dataActions = table.options.meta.tableState.data(
    (state) => state.actions
  );

  const calendatTimeRow = table.options.meta.tableState.data(
    (state) => state.rows[row.index]
  );

  const columnsInfo = table.options.meta.tableState.columns(
    (state) => state.info
  );

  const configInfo = table.options.meta.tableState.configState(
    (state) => state.info
  );

  // Calendar state
  const calendarTimeState = calendatTimeRow[tableColumn.key];

  /** state of cell value */
  const [showDatePicker, setShowDatePicker] = useState(false);

  function handleSpanOnClick(event: any) {
    event.preventDefault();
    setShowDatePicker(true);
  }

  function handleCalendarChange(date: Date) {
    const changed = DateTime.fromJSDate(date);
    dataActions.updateCell(
      row.index,
      tableColumn,
      changed,
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings()
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
    <div onClick={handleSpanOnClick}>
      <span className="calendar-time" style={{ width: column.getSize() }}>
        {DateTime.isDateTime(calendarTimeState)
          ? (calendarTimeState as DateTime).toFormat("yyyy-MM-dd h:mm a")
          : null}
      </span>
    </div>
  );
};

export default CalendarTimePortal;
