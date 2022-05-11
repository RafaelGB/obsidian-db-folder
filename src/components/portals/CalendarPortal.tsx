import { TableColumn, TableDataType } from "cdm/FolderModel";
import { CellContext } from "components/contexts/CellContext";
import { StyleVariables } from "helpers/Constants";
import React, { useContext, useState } from "react";
import Calendar from "react-calendar";
import ReactDOM from "react-dom";
import { DateTime } from "luxon";
import { usePopper } from "react-popper";

type CalendarProps = {
  intialState: TableDataType;
  column: TableColumn;
};
const CalendarPortal = (calendarProps: CalendarProps) => {
  const { column } = calendarProps;
  const [showCalendar, setShowCalendar] = useState(false);
  // Selector reference state
  const [calendarRef, setCalendarRef] = useState(null);
  // Selector popper state
  const [selectPop, setSelectPop] = useState(null);
  const { styles, attributes } = usePopper(calendarRef, selectPop);
  /** state of cell value */
  const { value, setValue } = useContext(CellContext);

  const [calendarState, setCalendarState] = useState(
    DateTime.fromFormat(value.value, "yyyy-MM-dd").toJSDate()
  );
  function handleCalendarChange(date: Date) {
    setCalendarState(date);
    setShowCalendar(false);
    setValue({
      value: DateTime.fromJSDate(date).toFormat("yyyy-MM-dd"),
      update: true,
    });
  }

  function handlerOnClick(e: any) {
    if (!column.isMetadata) {
      setShowCalendar(!showCalendar);
    }
  }

  function renderCalendar() {
    return (
      <div
        className="menu"
        ref={setSelectPop}
        {...attributes.popper}
        style={{
          ...styles.popper,
          zIndex: 4,
          minWidth: 200,
          maxWidth: 320,
          padding: "0.75rem",
          background: StyleVariables.BACKGROUND_SECONDARY,
        }}
        onBlur={() => setShowCalendar(false)}
      >
        <Calendar onChange={handleCalendarChange} value={calendarState} />
      </div>
    );
  }
  return (
    <>
      <div
        className="data-input calendar"
        ref={setCalendarRef}
        onClick={handlerOnClick}
      >
        <span>{value.value}</span>
      </div>
      {showCalendar &&
        ReactDOM.createPortal(
          renderCalendar(),
          document.getElementById("popper-container")
        )}
    </>
  );
};
export default CalendarPortal;
