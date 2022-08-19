import React, { useContext, useState } from "react";
import { TableCellContext } from "components/contexts/CellContext";
import { CheckboxProps } from "cdm/CheckboxModel";
import { TableColumn } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";

export function CheckboxCell(props: CheckboxProps) {
  const { defaultCell } = props;
  const { row, column, table } = defaultCell;
  const dataActions = table.options.meta.tableState.data(
    (state) => state.actions
  );
  const columns = table.options.meta.tableState.columns(
    (state) => state.columns
  );
  const ddbbConfig = table.options.meta.tableState.configState(
    (state) => state.ddbbConfig
  );
  /** state of cell value */
  const { contextValue, setContextValue } = useContext(TableCellContext);
  const [checked, setChecked] = useState(contextValue.value as boolean);
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
    setContextValue({ value: event.target.checked ? 1 : 0, update: true });
  };
  return (
    <div className={`${c("checkbox")}`}>
      <input type="checkbox" checked={checked} onChange={handleChange} />
    </div>
  );
}
