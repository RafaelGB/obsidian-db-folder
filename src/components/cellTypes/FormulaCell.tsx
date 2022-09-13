import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import { c } from "helpers/StylesHelper";
import React, { useEffect, useRef } from "react";

const FormulaCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell, table, row, column } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const formulaRef = useRef<HTMLDivElement>();
  const formulaRow = tableState.data((state) => state.rows[row.index]);
  const configInfo = tableState.configState((state) => state.info);
  const formulaInfo = tableState.automations((state) => state.info);

  useEffect(() => {
    if (formulaRef.current !== null) {
      formulaRef.current.innerHTML = "";
      const formulaResponse = formulaInfo
        .runFormula(
          tableColumn.config.formula_query,
          formulaRow,
          configInfo.getLocalSettings()
        )
        .toString();
      renderMarkdown(defaultCell, formulaResponse, formulaRef.current, 5);
    }
  }, [formulaRow]);
  return (
    <span
      ref={formulaRef}
      className={`${c("md_cell")}`}
      key={`formula_${cell.id}`}
    />
  );
};

export default FormulaCell;
