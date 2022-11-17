import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import { InputType } from "helpers/Constants";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import React, { useEffect, useRef } from "react";
import { ParseService } from "services/ParseService";

const FormulaCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell, table, row, column } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const formulaRef = useRef<HTMLDivElement>();
  const formulaRow = tableState.data((state) => state.rows[row.index]);
  const dataActions = tableState.data((state) => state.actions);
  const configInfo = tableState.configState((state) => state.info);
  const columnsInfo = tableState.columns((state) => state.info);
  const formulaInfo = tableState.automations((state) => state.info);
  const formulaCell = tableState.data(
    (state) =>
      ParseService.parseRowToCell(
        state.rows[row.index],
        tableColumn,
        InputType.FORMULA,
        configInfo.getLocalSettings()
      ) as string
  );

  useEffect(() => {
    if (formulaRef.current !== null) {
      const effectCallback = async () => {
        formulaRef.current.innerHTML = "";

        const formulaResponse = formulaInfo
          .runFormula(
            tableColumn.config.formula_query,
            formulaRow,
            configInfo.getLocalSettings()
          )
          .toString();

        await renderMarkdown(
          defaultCell,
          formulaResponse,
          formulaRef.current,
          5
        );

        // Save formula response on disk
        if (
          tableColumn.config.persist_formula &&
          formulaCell !== formulaResponse
        ) {
          const newCell = ParseService.parseRowToLiteral(
            formulaRow,
            tableColumn,
            formulaResponse
          );

          await dataActions.updateCell(
            row.index,
            tableColumn,
            newCell,
            columnsInfo.getAllColumns(),
            configInfo.getLocalSettings()
          );
        }
      };
      effectCallback();
    }
  }, [row]);
  return (
    <span
      ref={formulaRef}
      className={`${c(
        "md_cell " +
          getAlignmentClassname(
            tableColumn.config,
            configInfo.getLocalSettings()
          )
      )}`}
      key={`formula_${cell.id}`}
    />
  );
};

export default FormulaCell;
