import { TableDataType } from "cdm/FolderModel";
import { CellContext } from "components/contexts/CellContext";
import { StyleVariables } from "helpers/Constants";
import React, { useContext, useState } from "react";
import Calendar from "react-calendar";
import ReactDOM from "react-dom";
import { usePopper } from "react-popper";

type CalendarProps = {
  intialState: TableDataType;
};
const CalendarPortal = (calendarProps: any) => {
  const [calendarState, setCalendarState] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  // Selector reference state
  const [calendarRef, setCalendarRef] = useState(null);
  // Selector popper state
  const [selectPop, setSelectPop] = useState(null);
  const { styles, attributes } = usePopper(calendarRef, selectPop);
  /** state of cell value */
  const { value, setValue } = useContext(CellContext);
  function handleCalendarChange(date: Date) {
    setCalendarState(date);
    setShowCalendar(false);
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
        onClick={() => setShowCalendar(!showCalendar)}
        onBlur={() => setShowCalendar(false)}
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
