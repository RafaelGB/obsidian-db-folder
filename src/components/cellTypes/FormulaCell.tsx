import { CellComponentProps } from "cdm/ComponentsModel";
import { c } from "helpers/StylesHelper";
import React from "react";

const FormulaCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell, table, row } = defaultCell;
  const { tableState } = table.options.meta;
  const formulaRow = tableState.data((state) => state.rows[row.index]);
  const formulaInfo = tableState.automations((state) => state.info);
  return (
    <div className={`${c("md_cell")}`} key={`formula_${cell.id}`}>
      {formulaInfo.getFormula("sum")(formulaRow).toString()}
    </div>
  );
};

export default FormulaCell;
