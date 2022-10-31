import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { renderMarkdown } from "components/obsidianArq/MarkdownRenderer";
import { InputType } from "helpers/Constants";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { Link, Literal } from "obsidian-dataview";
import React, { useEffect, useRef } from "react";
import { ParseService } from "services/ParseService";

const RollupCell = (mdProps: CellComponentProps) => {
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
  const rollupCell = tableState.data(
    (state) =>
      ParseService.parseRowToCell(
        state.rows[row.index],
        tableColumn,
        InputType.ROLLUP,
        configInfo.getLocalSettings()
      ) as string
  );

  useEffect(() => {
    if (formulaRef.current !== null) {
      formulaRef.current.innerHTML = "";
      const relation = formulaRow[tableColumn.config.asociated_relation_id];
      if (!relation) {
        return;
      }
      const rollupResponse = formulaInfo
        .dispatchRollup(
          tableColumn.config,
          relation as Literal,
          configInfo.getLocalSettings()
        )
        .toString();

      renderMarkdown(defaultCell, rollupResponse, formulaRef.current, 5);

      // Save formula response on disk
      if (tableColumn.config.persist_rollup && rollupCell !== rollupResponse) {
        const newCell = ParseService.parseRowToLiteral(
          formulaRow,
          tableColumn,
          rollupResponse
        );

        dataActions.updateCell(
          row.index,
          tableColumn,
          newCell,
          columnsInfo.getAllColumns(),
          configInfo.getLocalSettings()
        );
      }
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
      key={`rollup_${cell.id}`}
    />
  );
};

export default RollupCell;
