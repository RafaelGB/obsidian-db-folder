import React, {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  useState,
} from "react";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import { Portal } from "@mui/material";
import { c } from "helpers/StylesHelper";
import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { ParseService } from "services/ParseService";
import { DEFAULT_SETTINGS, InputType } from "helpers/Constants";
import { Platform } from "obsidian";
import { parseLuxonDateToString } from "helpers/LuxonHelper";

const CalendarCell = (calendarProps: CellComponentProps) => {
  const { defaultCell } = calendarProps;
  const { row, column, table } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;

  const dataActions = tableState.data((state) => state.actions);
  const calendarRow = tableState.data((state) => state.rows[row.index]);
  const columnsInfo = tableState.columns((state) => state.info);
  const configInfo = tableState.configState((state) => state.info);
  const calendarCell = tableState.data(
    (state) =>
      ParseService.parseRowToCell(
        state.rows[row.index],
        tableColumn,
        InputType.CALENDAR,
        configInfo.getLocalSettings()
      ) as DateTime
  );

  /** state of cell value */
  const [showDatePicker, setShowDatePicker] = useState(false);

  function handleSpanOnClick(event: any) {
    event.preventDefault();
    setShowDatePicker(true);
  }

  function handleCalendarChange(date: Date) {
    const changed = date !== null ? DateTime.fromJSDate(date) : null;
    const newCell = ParseService.parseRowToLiteral(
      calendarRow,
      tableColumn,
      changed
    );

    dataActions.updateCell(
      row.index,
      tableColumn,
      newCell,
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings()
    );
  }

  const CalendarContainer = (containerProps: any) => {
    return (
      <Portal container={activeDocument.body}>{containerProps.children}</Portal>
    );
  };

  const closeEditCalendarCell = () => {
    // We need a delay to allow the click event of clearing the date to propagate
    setTimeout(() => {
      setShowDatePicker(false);
    }, 100);
  };

  const ReactDatePickerInput = forwardRef<
    HTMLInputElement,
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  >((props, ref) => <input ref={ref} {...props} readOnly />);

  return showDatePicker ? (
    <DatePicker
      dateFormat={DEFAULT_SETTINGS.local_settings.date_format}
      selected={
        DateTime.isDateTime(calendarCell)
          ? (calendarCell as unknown as DateTime).toJSDate()
          : null
      }
      onChange={handleCalendarChange}
      popperContainer={CalendarContainer}
      onClickOutside={closeEditCalendarCell}
      onCalendarClose={closeEditCalendarCell}
      customInput={Platform.isMobile ? <ReactDatePickerInput /> : null}
      autoFocus
      isClearable
      ariaLabelClose="Clear"
      placeholderText="Pick a date..."
    />
  ) : (
    <span
      className={`${c("calendar")}`}
      onClick={handleSpanOnClick}
      style={{ width: column.getSize() }}
    >
      {parseLuxonDateToString(
        calendarCell,
        configInfo.getLocalSettings().date_format
      )}
    </span>
  );
};

export default CalendarCell;
