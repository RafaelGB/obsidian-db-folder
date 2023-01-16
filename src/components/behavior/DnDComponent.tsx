import { c } from "helpers/StylesHelper";
import React, { ReactNode, useState } from "react";
import { useRef } from "react";

type DnDProps = {
  id: string;
  index: number;
  lambda: (draggedColumnId: string, targetColumnId: string) => void;
  children: ReactNode;
  [key: string]: any;
};

const DnDComponent = ({ ...dnd }: DnDProps, dataLabel = "dbfolderDragId") => {
  const ref = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      ref={ref}
      key={`${dnd.id}-${dnd.index}-dnd`}
      onDrop={(e) => {
        e.preventDefault();
        dnd.lambda(e.dataTransfer.getData(dataLabel), dnd.id);
        return false;
      }}
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData(dataLabel, dnd.id);
        e.currentTarget.classList.add(c("dnd-dragging"));
      }}
      onDragEnter={(e) => {
        e.currentTarget.classList.add(c("dnd-over"));
      }}
      onDragLeave={(e) => {
        e.currentTarget.classList.remove(c("dnd-over"));
      }}
      onDragEnd={(e) => {
        setIsDragging(false);
        e.currentTarget.classList.remove(c("dnd-dragging"));
        e.currentTarget.classList.remove(c("dnd-over"));
      }}
      onDragOver={(e) => {
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.dataTransfer.dropEffect = "move";
        return false;
      }}
      {...dnd.props}
      style={{
        ...dnd.style,
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      {dnd.children}
    </div>
  );
};

export default DnDComponent;
