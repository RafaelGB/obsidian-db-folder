import React, { useState } from "react";

export type CellDataType = {
  value: string;
  update: boolean;
};

type CellContextType = {
  value: CellDataType;
  setValue: (value: CellDataType) => void;
};
export const CellContext = React.createContext<CellContextType | null>(null); //exporting context object
