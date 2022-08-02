import { Literal } from "obsidian-dataview/lib/data-model/value";
import React from "react";

export type CellDataType = {
  value: Literal;
  update: boolean;
};

type CellContextType = {
  contextValue: CellDataType;
  setContextValue: (value: CellDataType) => void;
};
export const TableCellContext = React.createContext<CellContextType | null>(
  null
); //exporting context object
