import React, {
  DetailedHTMLProps,
  forwardRef,
  InputHTMLAttributes,
  useState,
} from "react";
import { DateTime } from "luxon";
import DatePicker from "react-datepicker";
import { Portal } from "@mui/material";
import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { ParseService } from "services/ParseService";
import { DEFAULT_SETTINGS, InputType } from "helpers/Constants";
import { c } from "helpers/StylesHelper";
import { Platform } from "obsidian";
import { parseLuxonDatetimeToString } from "helpers/LuxonHelper";

const CalendarTimeCell = (calendarTimeProps: CellComponentProps) => {
  const { defaultCell } = calendarTimeProps;
  const { row, table, column } = defaultCell;
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
        InputType.CALENDAR_TIME,
        configInfo.getLocalSettings()
      ) as DateTime
  );

  /** state of cell value */
  const [showDatePicker, setShowDatePicker] = useState(false);

  function handleSpanOnClick(event: any) {
    event.preventDefault();
    setShowDatePicker(true);
  }

  async function handleCalendarChange(date: Date) {
    const changed = date !== null ? DateTime.fromJSDate(date) : null;

    const newCell = ParseService.parseRowToLiteral(
      calendarRow,
      tableColumn,
      changed
    );

    await dataActions.updateCell(
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

  const closeEditCalendarTimeCell = () => {
    // We need a delay to allow the click event of clearing the date to propagate
    setTimeout(() => {
      setShowDatePicker(false);
    }, 100);
  };

  const ReactDatePickerInput = forwardRef<
    HTMLInputElement,
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
  >((props, ref) => <input ref={ref} {...props} readOnly />);

  return showDatePicker &&
    (tableColumn.isMetadata === undefined || !tableColumn.isMetadata) ? (
    <DatePicker
      dateFormat={DEFAULT_SETTINGS.local_settings.datetime_format}
      selected={calendarCell ? calendarCell.toJSDate() : null}
      onChange={handleCalendarChange}
      popperContainer={CalendarContainer}
      onClickOutside={closeEditCalendarTimeCell}
      onCalendarClose={closeEditCalendarTimeCell}
      customInput={Platform.isMobile ? <ReactDatePickerInput /> : null}
      timeFormat="HH:mm"
      timeCaption="time"
      showTimeSelect
      autoFocus
      isClearable
      ariaLabelClose="Clear"
      placeholderText="Pick a moment..."
    />
  ) : (
    <span
      className={`${c("calendar")}`}
      style={{ width: column.getSize() }}
      onClick={handleSpanOnClick}
    >
      {parseLuxonDatetimeToString(
        calendarCell,
        configInfo.getLocalSettings().datetime_format
      )}
    </span>
  );
};

export default CalendarTimeCell;
