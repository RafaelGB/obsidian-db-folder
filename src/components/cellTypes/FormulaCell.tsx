import { CellComponentProps } from "cdm/ComponentsModel";
import { c } from "helpers/StylesHelper";
import React from "react";

const FormulaCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell, table, row, column } = defaultCell;
  const { tableState } = table.options.meta;
  const formulaRow = tableState.data((state) => state.rows[row.index]);

  return <div className={`${c("md_cell")}`} key={`formula_${cell.id}`}></div>;
};

export default FormulaCell;
