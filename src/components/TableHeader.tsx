import React from "react";
import { HeaderContext } from "components/contexts/HeaderContext";
import { flexRender } from "@tanstack/react-table";
import { c } from "helpers/StylesHelper";
import { TableHeaderProps } from "cdm/HeaderModel";
import { useDrag, useDrop } from "react-dnd";
import type { Identifier, XYCoord } from "dnd-core";
import { TableColumn, TableDataType } from "cdm/FolderModel";
import { ActionTypes } from "helpers/Constants";
interface DragItem {
  index: number;
  id: string;
  type: string;
}

export default function TableHeader(headerProps: TableHeaderProps) {
  const {
    table,
    header,
    headerIndex,
    columnResizeMode,
    columnsWidthState,
    setColumnsWidthState,
  } = headerProps;
  const id = header.column.columnDef.id;
  const { dispatch, columns } = table.options.meta as TableDataType;
  const originalIndex = columns.indexOf(header.column.columnDef as TableColumn);
  //DnD
  const DnDref = React.useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!DnDref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = headerIndex;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = DnDref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "card",
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        console.log("end");
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          dispatch({
            type: ActionTypes.DND_MOVE_HEADER,
            droppedId: droppedId,
            originalIndex: originalIndex,
          });
        }
      },
    }),
    [id, originalIndex, dispatch]
  );

  const opacity = isDragging ? 0 : 1;
  drag(drop(DnDref));
  return (
    <div
      data-handler-id={handlerId}
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
