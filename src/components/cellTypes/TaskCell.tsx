import { CellComponentProps } from "cdm/ComponentsModel";
import { Grouping } from "obsidian-dataview/lib/data-model/value";
import {
  SListItem,
  STask,
} from "obsidian-dataview/lib/data-model/serialized/markdown";
import { DataviewService } from "services/DataviewService";
import React, { useEffect, useRef } from "react";
import { TableColumn } from "cdm/FolderModel";
import { MarkdownRenderChild } from "obsidian";
import { c } from "helpers/StylesHelper";

const TaskCell = (taskProps: CellComponentProps) => {
  const { defaultCell } = taskProps;
  const { cell, column, table, row } = defaultCell;
  const { view } = table.options.meta;
  const tableColumn = column.columnDef as TableColumn;
  useEffect(() => {
    let taskValue = cell.getValue();
    // Check if there are tasks in the cell
    if (taskValue) {
      taskRef.current.innerHTML = "";
      if (
        tableColumn.config.task_hide_completed &&
        DataviewService.isDataArray(taskValue)
      ) {
        taskValue = taskValue
          .where((t: STask) => !t.completed)
          .map((t: STask) => {
            t.children = t.children?.filter((c: STask) => !c.completed);
            return t;
          });
      }

      const taskComponent = new MarkdownRenderChild(taskRef.current);

      DataviewService.getDataviewAPI().taskList(
        taskValue as Grouping<SListItem>,
        false,
        taskRef.current,
        taskComponent,
        row.original.__note__.getFile().path
      );
      view.addChild(taskComponent);
    }
  }, []);
  const taskRef = useRef<HTMLDivElement>();

  return (
    <div
      ref={taskRef}
      className={c("md_cell text-align-left tabIndex")}
      tabIndex={0}
    />
  );
};

export default TaskCell;
