import React, { useContext, useState } from "react";
import { CellContext } from "components/contexts/CellContext";
import { ActionTypes } from "helpers/Constants";
import NoteInfo from "services/NoteInfo";
import { CheckboxProps } from "cdm/CheckboxModel";
import { TableColumn } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";

export function CheckboxCell(props: CheckboxProps) {
  const { column, cellProperties } = props;
  const { row, table } = cellProperties;
  const dataDispatch = table.options.meta.dispatch;
  /** Note info of current Cell */
  const note: NoteInfo = row.original.__note__;
  /** state of cell value */
  const { contextValue, setContextValue } = useContext(CellContext);
  const [checked, setChecked] = useState(contextValue.value as boolean);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked ? 1 : 0;
    // save on disk
    dataDispatch({
      type: ActionTypes.UPDATE_CELL,
      file: note.getFile(),
      key: (column.columnDef as TableColumn).key,
      value: newValue,
      row: row,
      columnId: column.id,
      state: table.options.meta.tableState,
    });
    setChecked(event.target.checked);
    setContextValue({ value: event.target.checked ? 1 : 0, update: true });
  };
  return (
    <div className={`${c("checkbox")}`}>
      <input type="checkbox" checked={checked} onChange={handleChange} />
    </div>
  );
}
