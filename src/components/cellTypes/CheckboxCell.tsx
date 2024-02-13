import React from "react";
import { TableColumn } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import { CellComponentProps } from "cdm/ComponentsModel";
import { ParseService } from "services/ParseService";
import {DEFAULT_SETTINGS, InputType} from "helpers/Constants";
import {Notice} from "obsidian";

function CheckboxCell(props: CellComponentProps) {
  const { defaultCell } = props;
  const { row, column, table } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;

  const dataActions = tableState.data((state) => state.actions);
  const checkboxRow = tableState.data((state) => state.rows[row.index]);
  const columnsInfo = tableState.columns((state) => state.info);
  const configInfo = tableState.configState((state) => state.info);
  const isBinaryCellType = DEFAULT_SETTINGS.local_settings.binary_checkbox_type;
  const checkboxCell = tableState.data(
    (state) =>
      ParseService.parseRowToCell(
        state.rows[row.index],
        tableColumn,
          isBinaryCellType ? InputType.NUMBER : InputType.CHECKBOX,
        configInfo.getLocalSettings()
      ) as boolean | number
  );

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    editCheckbox( isBinaryCellType ? (newValue ? 1 : 0) : newValue );
  };

  const editCheckbox = async (newValue: boolean | number) => {
    const newCell = ParseService.parseRowToLiteral(
      checkboxRow,
      tableColumn,
      newValue
    );

    // save on disk
    await dataActions.updateCell({
      rowIndex: row.index,
      column: tableColumn,
      value: newCell,
      columns: columnsInfo.getAllColumns(),
      ddbbConfig: configInfo.getLocalSettings(),
    });
  };

  return (
    <div
      key={`checkbox-div-${row.index}`}
      className={`${c("checkbox tabIndex")}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          editCheckbox(isBinaryCellType ? (checkboxCell ? 1 : 0) : !checkboxCell);
        }
      }}
    >
      <input
        type="checkbox"
        checked={!!checkboxCell}
        key={`checkbox-input-${row.index}`}
        onChange={handleChange}
      />
    </div>
  );
}

export default CheckboxCell;
