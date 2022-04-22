// TODO add typing
const DraggableStyle = (styleProps:any) => ({
    ...styleProps.draggableStyle,
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    ...(!styleProps.dragableProps.isDragging && { transform: "translate(0,0)" }),
    ...(styleProps.dragableProps.isDropAnimating && { transitionDuration: "0.001s" })
  
    // styles we need to apply on draggables
  });

export default DraggableStyle;