import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { InputType, SUGGESTER_REGEX } from "helpers/Constants";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import React, {
  ChangeEventHandler,
  KeyboardEventHandler,
  useState,
} from "react";
import { ParseService } from "services/ParseService";

const NumberCell = (props: CellComponentProps) => {
  const { defaultCell } = props;
  const { row, column, table } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  /** Cell information */
  const columnsInfo = tableState.columns((state) => state.info);
  const dataActions = tableState.data((state) => state.actions);
  const configInfo = tableState.configState((state) => state.info);
  const numberRow = tableState.data((state) => state.rows[row.index]);
  const numberCell = tableState.data(
    (state) =>
      ParseService.parseRowToCell(
        state.rows[row.index],
        tableColumn,
        InputType.NUMBER,
        configInfo.getLocalSettings()
      ) as number
  );
  const [editableValue, setEditableValue] = useState(null);
  const [dirtyCell, setDirtyCell] = useState(false);

  const handleEditableOnclick = () => {
    setDirtyCell(true);
    setEditableValue(numberCell);
  };

  // onChange handler
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    // parse value to number
    setEditableValue(event.target.value);
  };

  function persistChange(changedValue: number) {
    const newCell = ParseService.parseRowToLiteral(
      numberRow,
      tableColumn,
      changedValue
    );
    dataActions.updateCell(
      row.index,
      tableColumn,
      newCell,
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
    if (editableValue && editableValue !== numberCell) {
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
      onDoubleClick={handleEditableOnclick}
      style={{ width: column.getSize() }}
      onKeyDown={(e) => {
        if (SUGGESTER_REGEX.CELL_VALID_KEYDOWN.test(e.key)) {
          handleEditableOnclick();
        } else if (e.key === "Enter") {
          e.preventDefault();
          handleEditableOnclick();
        }
      }}
      tabIndex={0}
    >
      {(numberCell !== undefined && numberCell.toString()) || ""}
    </span>
  );
};

export default NumberCell;
