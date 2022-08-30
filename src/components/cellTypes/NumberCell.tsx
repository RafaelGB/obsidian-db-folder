import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import React, { useState } from "react";

const NumberCell = (props: CellComponentProps) => {
  const { defaultCell } = props;
  const { cell, row, column, table } = defaultCell;

  /** Columns information */
  const columnsInfo = table.options.meta.tableState.columns(
    (state) => state.info
  );
  const dataActions = table.options.meta.tableState.data(
    (state) => state.actions
  );
  const configInfo = table.options.meta.tableState.configState(
    (state) => state.info
  );

  const [cellValue, setCellValue] = useState(cell.getValue());
  const [dirtyCell, setDirtyCell] = useState(false);

  const [editNoteTimeout, setEditNoteTimeout] = useState(null);

  const handleEditableOnclick = (event: any) => {
    setDirtyCell(true);
  };

  // onChange handler
  const handleOnChange = (event: any) => {
    setDirtyCell(true);
    // cancelling previous timeouts
    if (editNoteTimeout) {
      clearTimeout(editNoteTimeout);
    }
    // first update the input text as user type
    setCellValue(event.target.value);
    // initialize a setimeout by wrapping in our editNoteTimeout so that we can clear it out using clearTimeout
    setEditNoteTimeout(
      setTimeout(() => {
        onChange(event.target.value);
        // timeout until event is triggered after user has stopped typing
      }, 1500)
    );
  };

  function onChange(changedValue: string) {
    dataActions.updateCell(
      row.index,
      column.columnDef as TableColumn,
      changedValue,
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings()
    );
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };

  const handleOnBlur = (event: any) => {
    setDirtyCell(false);
  };

  return dirtyCell ? (
    <input
      value={(cellValue && cellValue.toString()) || ""}
      onChange={handleOnChange}
      onKeyDown={handleKeyDown}
      onBlur={handleOnBlur}
      className="text-align-right"
    />
  ) : (
    <span
      className="text-align-right"
      onClick={handleEditableOnclick}
      style={{ width: column.getSize() }}
    >
      {(cellValue && cellValue.toString()) || ""}
    </span>
  );
};

export default NumberCell;
