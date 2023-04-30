import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { InputType, MetadataColumns } from "helpers/Constants";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import React, { useEffect, useRef } from "react";
import { MarkdownService } from "services/MarkdownRenderService";
import { ParseService } from "services/ParseService";

const FormulaCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell, table, row, column } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const formulaRef = useRef<HTMLDivElement>();
  const formulaRow = tableState.data((state) => state.rows[row.index]);
  const dataActions = tableState.data((state) => state.actions);
  const formulaInfo = tableState.automations((state) => state.info);
  const configInfo = tableState.configState((state) => state.info);
  const dataInfo = tableState.data((state) => state.info);
  const columnsInfo = tableState.columns((state) => state.info);
  const automationInfo = tableState.automations((state) => state.info);

  useEffect(() => {
    Promise.resolve().then(async () => {
      // If formula cell is empty, do nothing
      if (formulaRef.current === null) return;
      const formulaResponse = formulaInfo
        .runFormula(tableColumn.config.formula_query, formulaRow, {
          data: dataInfo,
          columns: columnsInfo,
          config: configInfo,
          automation: automationInfo,
        })
        .toString();

      await MarkdownService.renderMarkdown(
        defaultCell,
        formulaResponse,
        formulaRef.current,
        5
      );
      // If formula cell is not configured to persist, exit
      if (cell.getValue() === formulaResponse) return;
      // Save formula response on disk
      const newCell = ParseService.parseRowToLiteral(
        formulaRow,
        tableColumn,
        formulaResponse
      );

      await dataActions.updateCell({
        rowIndex: row.index,
        column: tableColumn,
        value: ParseService.parseLiteral(
          newCell,
          tableColumn.config.formula_persist_type ?? InputType.TEXT,
          configInfo.getLocalSettings()
        ),
        columns: columnsInfo.getAllColumns(),
        ddbbConfig: configInfo.getLocalSettings(),
        saveOnDisk: tableColumn.config.persist_changes ?? false,
      });
    });
  }, [
    Object.entries(formulaRow)
      .filter(([key]) => key !== MetadataColumns.MODIFIED && key !== column.id)
      .map(([, value]) => (value ? value.toString() : ""))
      .join(""),
  ]);

  return (
    <span
      ref={formulaRef}
      className={`${c(
        "md_cell " +
          getAlignmentClassname(
            tableColumn.config,
            configInfo.getLocalSettings(),
            ["tabIndex"]
          )
      )}`}
      key={`formula_${cell.id}`}
      tabIndex={0}
    />
  );
};

export default FormulaCell;
