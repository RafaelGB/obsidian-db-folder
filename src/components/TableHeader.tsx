import React from "react";
import { Column, flexRender } from "@tanstack/react-table";
import { c } from "helpers/StylesHelper";
import { TableHeaderProps } from "cdm/HeaderModel";
import { useDrag, useDrop } from "react-dnd";
import { RowDataType } from "cdm/FolderModel";
import { DnDConfiguration } from "helpers/Constants";

export default function TableHeader(headerProps: TableHeaderProps) {
  const { table, header, reorderColumn, headerIndex } = headerProps;
  const { view } = table.options.meta;
  const { columnOrder } = table.options.state;

  function moveColumn(
    draggedColumnId: string,
    targetColumnId: string,
    columnOrder: string[]
  ) {
    const newColumnOrder = reorderColumn(
      draggedColumnId,
      targetColumnId,
      columnOrder
    );
    // Save on disk
    view.diskConfig.reorderColumns(newColumnOrder);
    // Save on memory
    return newColumnOrder;
  }

  const [, dropRef] = useDrop({
    accept: DnDConfiguration.DRAG_TYPE,
    drop: (draggedColumn: Column<RowDataType>) => {
      const newColumnOrder = moveColumn(
        draggedColumn.id,
        header.column.id,
        columnOrder
      );
      table.setColumnOrder(newColumnOrder);
    },
  });

  const [{ isDragging }, dragRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => header.column,
    type: DnDConfiguration.DRAG_TYPE,
  });

  return (
    <div
      key={`${header.id}-${headerIndex}`}
      className={`${c("th noselect")} header`}
      style={{
        width: header.getSize(),
        opacity: isDragging ? 0.5 : 1,
      }}
      ref={dropRef}
    >
      <div ref={dragRef} key={`${header.id}-${headerIndex}-dnd`}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </div>
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
