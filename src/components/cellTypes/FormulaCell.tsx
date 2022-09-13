import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { c } from "helpers/StylesHelper";
import React from "react";

const FormulaCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell, table, row, column } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const formulaRow = tableState.data((state) => state.rows[row.index]);
  const configInfo = tableState.configState((state) => state.info);
  const formulaInfo = tableState.automations((state) => state.info);
  return (
    <div className={`${c("md_cell")}`} key={`formula_${cell.id}`}>
      {formulaInfo
        .runFormula(
          tableColumn.config.formula_query,
          formulaRow,
          configInfo.getLocalSettings()
        )
        .toString()}
    </div>
  );
};

export default FormulaCell;
