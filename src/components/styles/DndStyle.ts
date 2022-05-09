import { StyleVariables } from "helpers/Constants";

export const getDndItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // change background colour if dragging
    background: isDragging ? StyleVariables.BACKGROUND_SECONDARY : StyleVariables.BACKGROUND_PRIMARY,
    // styles we need to apply on draggables
    ...draggableStyle,
});

export const getDndListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'lightblue' : StyleVariables.BACKGROUND_PRIMARY,
    height: '100%',
    width: '100%',
    top: '0'
});