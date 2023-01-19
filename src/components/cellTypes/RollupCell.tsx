import { CellComponentProps } from "cdm/ComponentsModel";
import { TableColumn } from "cdm/FolderModel";
import { InputType } from "helpers/Constants";
import { c, getAlignmentClassname } from "helpers/StylesHelper";
import { Literal } from "obsidian-dataview";
import React, { useEffect, useRef } from "react";
import { MarkdownService } from "services/MarkdownRenderService";
import { ParseService } from "services/ParseService";

const RollupCell = (mdProps: CellComponentProps) => {
  const { defaultCell } = mdProps;
  const { cell, table, row, column } = defaultCell;
  const { tableState } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  const rollupRef = useRef<HTMLDivElement>();
  const rollupRow = tableState.data((state) => state.rows[row.index]);
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
  const relation = rollupRow[tableColumn.config.asociated_relation_id];

  useEffect(() => {
    if (rollupRef.current !== null) {
      rollupRef.current.innerHTML = "";
      if (!relation) {
        return;
      }
      const rollupResponse = formulaInfo
        .dispatchRollup(tableColumn.config, relation as Literal)
        .toString();

      MarkdownService.renderMarkdown(
        defaultCell,
        rollupResponse,
        rollupRef.current,
        5
      );

      if (rollupCell === rollupResponse) return;
      // Save formula response on disk
      const newCell = ParseService.parseRowToLiteral(
        rollupRow,
        tableColumn,
        rollupResponse
      );

      dataActions.updateCell({
        rowIndex: row.index,
        column: tableColumn,
        value: newCell,
        columns: columnsInfo.getAllColumns(),
        ddbbConfig: configInfo.getLocalSettings(),
        saveOnDisk: tableColumn.config.persist_changes ?? false,
      });
    }
  }, [relation]);
  return (
    <span
      ref={rollupRef}
      className={`${c(
        "md_cell " +
          getAlignmentClassname(
            tableColumn.config,
            configInfo.getLocalSettings(),
            ["tabIndex"]
          )
      )}`}
      key={`rollup_${cell.id}`}
      tabIndex={0}
    />
  );
};

export default RollupCell;
