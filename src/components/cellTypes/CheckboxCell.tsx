import React, { useState } from "react";
import { TableColumn } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import { CellComponentProps } from "cdm/ComponentsModel";

function CheckboxCell(props: CellComponentProps) {
  const { defaultCell } = props;
  const { row, column, table } = defaultCell;
  const tableColumn = column.columnDef as TableColumn;

  const [rows, dataActions] = table.options.meta.tableState.data((state) => [
    state.rows,
    state.actions,
  ]);
  const columns = table.options.meta.tableState.columns(
    (state) => state.columns
  );
  const ddbbConfig = table.options.meta.tableState.configState(
    (state) => state.ddbbConfig
  );
  /** state of cell value */
  const [checked, setChecked] = useState(
    Boolean(rows[row.index][tableColumn.key])
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked ? 1 : 0;
    // save on disk
    dataActions.updateCell(
      row.index,
      column.columnDef as TableColumn,
      newValue,
      columns,
      ddbbConfig
    );
    setChecked(event.target.checked);
  };

  return (
    <div className={`${c("checkbox")}`}>
      <input type="checkbox" checked={checked} onChange={handleChange} />
    </div>
  );
}

export default CheckboxCell;
