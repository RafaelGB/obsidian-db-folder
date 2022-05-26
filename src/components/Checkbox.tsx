import React, { useContext, useState } from "react";
import { CellContext } from "components/contexts/CellContext";
import { ActionTypes } from "helpers/Constants";
import { TableColumn, TableDataType } from "cdm/FolderModel";
import { Cell } from "react-table";
import NoteInfo from "services/NoteInfo";

type CheckboxProps = {
  intialState: TableDataType;
  column: TableColumn;
  cellProperties: Cell;
};
export function CheckboxCell(props: CheckboxProps) {
  const { intialState, column, cellProperties } = props;
  const dataDispatch = (cellProperties as any).dataDispatch;
  /** Note info of current Cell */
  const note: NoteInfo = (cellProperties.row.original as any).note;
  /** state of cell value */
  const { contextValue, setContextValue } = useContext(CellContext);
  const [checked, setChecked] = useState(contextValue.value === 1);
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
  console.log(`${contextValue.value}`);
  return <input type="checkbox" checked={checked} onChange={handleChange} />;
}
