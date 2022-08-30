import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { Literal } from "obsidian-dataview";
import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useEffect,
  useState,
} from "react";

const NumberCell = (props: CellComponentProps) => {
  const { defaultCell } = props;
  const { row, column, table } = defaultCell;

  /** Columns information */
  const columnsInfo = table.options.meta.tableState.columns(
    (state) => state.info
  );
  const dataActions = table.options.meta.tableState.data(
    (state) => state.actions
  );

  const numberRow = table.options.meta.tableState.data(
    (state) => state.rows[row.index]
  );

  const configInfo = table.options.meta.tableState.configState(
    (state) => state.info
  );

  const [cellValue, setCellValue] = useState(numberRow[column.id] as number);
  const [dirtyCell, setDirtyCell] = useState(false);

  const handleEditableOnclick = () => {
    setDirtyCell(true);
  };

  // onChange handler
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    // parse value to number
    const value = parseFloat(event.target.value);
    setCellValue(value);
  };

  function persistChange(changedValue: number) {
    dataActions.updateCell(
      row.index,
      column.columnDef as TableColumn,
      changedValue,
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings()
    );
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    event: any
  ) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };

  const handleOnBlur = () => {
    persistChange(cellValue);
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
