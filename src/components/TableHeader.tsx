import React from "react";
import { flexRender } from "@tanstack/react-table";
import { c } from "helpers/StylesHelper";
import { TableHeaderProps } from "cdm/HeaderModel";
import { useDrag, useDrop } from "react-dnd";
import { TableColumn, TableDataType } from "cdm/FolderModel";
import { ActionTypes } from "helpers/Constants";
interface Item {
  id: string;
  originalIndex: number;
}

export default function TableHeader(headerProps: TableHeaderProps) {
  const {
    table,
    header,
    findColumn,
    headerIndex,
    columnResizeMode,
    setColumnOrder,
  } = headerProps;
  const { id } = header.column.columnDef as TableColumn;
  const { dispatch, columns, view } = table.options.meta as TableDataType;
  const originalIndex = columns.findIndex((col) => col.id === id);
  //DnD
  const DnDref = React.useRef<HTMLDivElement>(null);

  function moveColumn(source: number, destinationKey: string) {
    const { index: destIndex } = findColumn(destinationKey);
    const initialOrder = table.getAllColumns().map((d) => d.id);
    initialOrder.splice(destIndex, 1);
    initialOrder.splice(source, 0, columns[destIndex].id);
    setColumnOrder(initialOrder);
    view.diskConfig.reorderColumns(initialOrder);
  }
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "card",
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          moveColumn(originalIndex, droppedId);
        }
      },
    }),
    [id, originalIndex, findColumn]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "card",
      hover({ id: draggedId }: Item) {
        if (draggedId !== id) {
          const { index: overIndex } = findColumn(id);
          moveColumn(overIndex, draggedId);
        }
      },
    }),
    [findColumn, dispatch]
  );

  const opacity = isDragging ? 0 : 1;
  drag(drop(DnDref));
  return (
    <div
      ref={DnDref}
      key={`${header.id}-${headerIndex}`}
      className={`${c("th noselect")} header`}
      style={{
        width: header.getSize(),
        opacity,
      }}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      <div
        key={`${header.id}-${headerIndex}-resizer`}
        {...{
          onMouseDown: header.getResizeHandler(),
          onTouchStart: header.getResizeHandler(),
          className: `resizer ${
            header.column.getIsResizing() ? "isResizing" : ""
          }`,
          style: {
            transform:
              columnResizeMode === "onEnd" && header.column.getIsResizing()
                ? `translateX(${
                    table.getState().columnSizingInfo.deltaOffset
                  }px)`
                : "",
          },
        }}
      />
    </div>
  );
}
