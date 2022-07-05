import React, { useContext, useState } from "react";
import { CellContext } from "components/contexts/CellContext";
import { ActionTypes } from "helpers/Constants";
import { TableColumn, TableDataType } from "cdm/FolderModel";
import { Cell } from "@tanstack/react-table";
import NoteInfo from "services/NoteInfo";
import { DataviewService } from "services/DataviewService";

type CheckboxProps = {
  intialState: TableDataType;
  column: TableColumn;
  cellProperties: Cell;
};
export function CheckboxCell(props: CheckboxProps) {
  const { column, cellProperties } = props;
  const dataDispatch = (cellProperties as any).dataDispatch;
  /** Note info of current Cell */
  const note: NoteInfo = (cellProperties.row.original as any).__note__;
  /** state of cell value */
  const { contextValue, setContextValue } = useContext(CellContext);
  const [checked, setChecked] = useState(
    DataviewService.getDataviewAPI().value.isBoolean(contextValue.value)
  );
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked ? 1 : 0;
    // save on disk
    dataDispatch({
      type: ActionTypes.UPDATE_CELL,
      file: note.getFile(),
      key: column.key,
      value: newValue,
      row: cellProperties.row,
      columnId: column.id,
    });
    setChecked(event.target.checked);
    setContextValue({ value: event.target.checked ? 1 : 0, update: true });
  };
  return (
    <div className="data-input-checkbox">
      <input type="checkbox" checked={checked} onChange={handleChange} />
    </div>
  );
}
