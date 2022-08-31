import React, { useState } from "react";
import { TableColumn } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import { CellComponentProps } from "cdm/ComponentsModel";

function CheckboxCell(props: CellComponentProps) {
  const { defaultCell } = props;
  const { row, column, table } = defaultCell;
  const tableColumn = column.columnDef as TableColumn;

  const dataActions = table.options.meta.tableState.data(
    (state) => state.actions
  );

  const checkboxCell = table.options.meta.tableState.data(
    (state) => state.rows[row.index]
  );

  const columnsInfo = table.options.meta.tableState.columns(
    (state) => state.info
  );

  const configInfo = table.options.meta.tableState.configState(
    (state) => state.info
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked ? 1 : 0;
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
    <div className={`${c("checkbox")}`}>
      <input
        type="checkbox"
        checked={Boolean(checkboxCell[tableColumn.key])}
        onChange={handleChange}
      />
    </div>
  );
}

export default CheckboxCell;
