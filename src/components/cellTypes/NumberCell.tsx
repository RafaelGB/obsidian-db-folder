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
  const { tableState } = table.options.meta;
  /** Cell information */
  const columnsInfo = tableState.columns((state) => state.info);
  const dataActions = tableState.data((state) => state.actions);
  const numberRow = tableState.data((state) => state.rows[row.index]);
  const configInfo = tableState.configState((state) => state.info);

  const [editableValue, setEditableValue] = useState(null);
  const [dirtyCell, setDirtyCell] = useState(false);

  const handleEditableOnclick = () => {
    setDirtyCell(true);
    setEditableValue(numberRow[column.id] as number);
  };

  // onChange handler
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    // parse value to number
    const value = parseFloat(event.target.value);
    setEditableValue(value);
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
    persistChange(editableValue);
    setDirtyCell(false);
  };

  return dirtyCell ? (
    <input
      value={(editableValue && editableValue.toString()) || ""}
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
      {(numberRow[column.id] && numberRow[column.id].toString()) || ""}
    </span>
  );
};

export default NumberCell;
