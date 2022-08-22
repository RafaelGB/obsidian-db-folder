import React, { useState } from "react";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import { Portal } from "@mui/material";
import { c } from "helpers/StylesHelper";
import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";

const CalendarPortal = (calendarProps: CellComponentProps) => {
  const { defaultCell } = calendarProps;
  const { row, column, table } = defaultCell;
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

  /** state of cell value */
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarValue, setCalendarValue] = useState(
    rows[row.index][tableColumn.key]
  );

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
      columns,
      ddbbConfig
    );
    setCalendarValue(changed);
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
        DateTime.isDateTime(calendarValue)
          ? (calendarValue as unknown as DateTime).toJSDate()
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
      {DateTime.isDateTime(calendarValue)
        ? (calendarValue as unknown as DateTime).toFormat("yyyy-MM-dd")
        : null}
    </span>
  );
};

export default CalendarPortal;
