import React from "react";
import { HeaderContext } from "components/contexts/HeaderContext";
import { flexRender } from "@tanstack/react-table";
import { c } from "helpers/StylesHelper";
import { TableHeaderProps } from "cdm/HeaderModel";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";
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
    columnsWidthState,
    setColumnsWidthState,
  } = headerProps;
  const { id } = header.column.columnDef as TableColumn;
  const { dispatch, columns } = table.options.meta as TableDataType;
  const originalIndex = columns.findIndex((col) => col.id === id);
  //DnD
  const DnDref = React.useRef<HTMLDivElement>(null);
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
        console.log(
          "useDrag droppedId-originalIndex",
          droppedId,
          originalIndex
        );
        if (!didDrop) {
          dispatch({
            type: ActionTypes.DND_MOVE_HEADER,
            droppedId: droppedId,
            originalIndex: originalIndex,
          });
        }
      },
    }),
    [id, originalIndex, findColumn]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "card",
      hover({ id: draggedId }: Item) {
        console.log("useDrop draggedId", draggedId);
        if (draggedId !== id) {
          const { index: overIndex } = findColumn(id);
          dispatch({
            type: ActionTypes.DND_MOVE_HEADER,
            destinationId: draggedId,
            originalIndex: overIndex,
          });
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
      <HeaderContext.Provider
        value={{
          columnWidthState: columnsWidthState,
          setColumnWidthState: setColumnsWidthState,
        }}
      >
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
      </HeaderContext.Provider>
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
