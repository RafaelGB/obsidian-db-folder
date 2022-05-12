import { Literal } from "obsidian-dataview/lib/data-model/value";
import React from "react";
import NoteInfo from "services/NoteInfo";

export type CellDataType = {
  value: Literal | NoteInfo;
  update: boolean;
};

type CellContextType = {
  contextValue: CellDataType;
  setContextValue: (value: CellDataType) => void;
};
export const CellContext = React.createContext<CellContextType | null>(null); //exporting context object
