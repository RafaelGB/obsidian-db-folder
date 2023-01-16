import React from "react";
import { flexRender } from "@tanstack/react-table";
import { c } from "helpers/StylesHelper";
import { TableHeaderProps } from "cdm/HeaderModel";
import DnDComponent from "./behavior/DnDComponent";

export default function TableHeader(tableHeaderProps: TableHeaderProps) {
  const { table, header, reorderColumn, headerIndex } = tableHeaderProps;
  const { view } = table.options.meta;
  const { columnOrder } = table.options.state;
  const dndRef = React.useRef(null);
  function moveColumn(draggedColumnId: string, targetColumnId: string) {
    const newColumnOrder = reorderColumn(
      draggedColumnId,
      targetColumnId,
      columnOrder
    );
    table.setColumnOrder(newColumnOrder);

    // Save on disk
    view.diskConfig.reorderColumns(newColumnOrder);
    // Save on memory
    return newColumnOrder;
  }

  return (
    <div
      key={`${header.id}-${headerIndex}`}
      className={`${c("th noselect")} header`}
      ref={dndRef}
      style={{
        width: header.getSize(),
      }}
    >
      <DnDComponent
        id={header.column.id}
        index={headerIndex}
        lambda={moveColumn}
      >
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </DnDComponent>

      <div
        key={`${header.id}-${headerIndex}-resizer`}
        {...{
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),

          className: `resizer ${
            header.column.getIsResizing() ? "isResizing" : ""
          }`,
        }}
      />
    </div>
  );
}
