import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
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
  const tableColumn = column.columnDef as TableColumn;
  const [editableValue, setEditableValue] = useState(null);
  const [dirtyCell, setDirtyCell] = useState(false);

  const handleEditableOnclick = () => {
    setDirtyCell(true);
    setEditableValue(numberRow[column.id] as number);
  };

  // onChange handler
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    // parse value to number
    setEditableValue(event.target.value);
  };

  function persistChange(changedValue: number) {
    dataActions.updateCell(
      row.index,
      tableColumn,
      changedValue,
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings()
    );
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    event: any
  ) => {
    switch (event.key) {
      case "Enter":
        event.target.blur();
        break;
      case "Escape":
        setDirtyCell(false);
        break;
      default:
      // Do nothing
    }
  };

  const handleOnBlur = () => {
    if (editableValue && editableValue !== numberRow[column.id]) {
      persistChange(parseFloat(editableValue));
    }
    setDirtyCell(false);
  };

  return dirtyCell ? (
    <input
      autoFocus
      value={(editableValue && editableValue.toString()) || ""}
      onChange={handleOnChange}
      onKeyDown={handleKeyDown}
      onBlur={handleOnBlur}
      className={c(
        getAlignmentClassname(tableColumn.config, configInfo.getLocalSettings())
      )}
    />
  ) : (
    <span
      className={c(
        getAlignmentClassname(tableColumn.config, configInfo.getLocalSettings())
      )}
      onClick={handleEditableOnclick}
      style={{ width: column.getSize() }}
    >
      {(numberRow[column.id] !== undefined &&
        numberRow[column.id].toString()) ||
        ""}
    </span>
  );
};

export default NumberCell;
