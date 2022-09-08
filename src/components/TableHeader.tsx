import React from "react";
import { flexRender } from "@tanstack/react-table";
import { c } from "helpers/StylesHelper";
import { TableHeaderProps } from "cdm/HeaderModel";

export default function TableHeader(headerProps: TableHeaderProps) {
  const { table, header, reorderColumn, headerIndex } = headerProps;
  const { view } = table.options.meta;
  const { columnOrder } = table.options.state;
  const [isDragging, setIsDragging] = React.useState(false);
  const dndRef = React.useRef(null);
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

  return (
    <div
      key={`${header.id}-${headerIndex}`}
      className={`${c("th noselect")} header`}
      ref={dndRef}
      style={{
        width: header.getSize(),
        opacity: isDragging ? 0.5 : 1,
      }}
      onDrop={(e) => {
        e.preventDefault();
        const newColumnOrder = moveColumn(
          e.dataTransfer.getData("dbfolderDragId"),
          header.column.id,
          columnOrder
        );
        table.setColumnOrder(newColumnOrder);
        return false;
      }}
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("dbfolderDragId", header.column.id);
      }}
      onDragEnter={(e) => {
        dndRef.current.classList.add("over");
      }}
      onDragLeave={(e) => {
        dndRef.current.classList.remove("over");
      }}
      onDragEnd={(e) => {
        setIsDragging(false);
      }}
      onDragOver={(e) => {
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.dataTransfer.dropEffect = "move";
        return false;
      }}
    >
      <div key={`${header.id}-${headerIndex}-dnd`}>
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
