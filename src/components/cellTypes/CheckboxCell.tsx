import React from "react";
import { TableColumn } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import { CellComponentProps } from "cdm/ComponentsModel";

function CheckboxCell(props: CellComponentProps) {
  const { defaultCell } = props;
  const { row, column, table } = defaultCell;
  const { tableState } = table.options.meta;

  const dataActions = tableState.data((state) => state.actions);

  const checkboxRow = tableState.data((state) => state.rows[row.index]);

  const columnsInfo = tableState.columns((state) => state.info);

  const configInfo = tableState.configState((state) => state.info);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    // save on disk
    dataActions.updateCell(
      row.index,
      column.columnDef as TableColumn,
      newValue,
      columnsInfo.getAllColumns(),
      configInfo.getLocalSettings()
    );
  };
  return (
    <div key={`checkbox-div-${row.index}`} className={`${c("checkbox")}`}>
      <input
        type="checkbox"
        checked={checkboxRow[column.id] as boolean}
        key={`checkbox-input-${row.index}`}
        onChange={handleChange}
      />
    </div>
  );
}

export default CheckboxCell;
