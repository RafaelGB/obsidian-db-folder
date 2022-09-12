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
  const { tableState, view } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const dataActions = tableState.data((state) => state.actions);

  const calendarPortalRow = tableState.data((state) => state.rows[row.index]);

  const columnsInfo = tableState.columns((state) => state.info);
  const configInfo = tableState.configState((state) => state.info);

  /** state of cell value */
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarValue, setCalendarValue] = useState(
    calendarPortalRow[tableColumn.key]
  );

  function handleSpanOnClick(event: any) {
    event.preventDefault();
    setShowDatePicker(true);
  }

  function handleCalendarChange(date: Date) {
    const changed = date !== null ? DateTime.fromJSDate(date) : null;
    dataActions.updateCell(
      row.index,
      tableColumn,
      changed,
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings()
    );
    setCalendarValue(changed);
    setShowDatePicker(false);
  }

  const CalendarContainer = (containerProps: any) => {
    const el = activeDocument.getElementById(`${view.file.path}-popper`);
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
      isClearable
      clearButtonTitle="Clear"
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
