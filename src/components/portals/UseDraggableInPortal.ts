import { DraggableProvided, DraggingStyle } from 'react-beautiful-dnd'
import { ReactElement, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export const useDraggableInPortal = () => {
  const element = useRef<HTMLDivElement>(document.createElement('div')).current

  useEffect(() => {
    if (element) {
      element.style.pointerEvents = 'none'
      element.style.position = 'absolute'
      element.style.height = '100%'
      element.style.width = '100%'
      element.style.top = '0'

      document.body.appendChild(element)

      return () => {
        document.body.removeChild(element)
      }
    }
  }, [element])

  return (render: (provided: DraggableProvided) => ReactElement) => (provided: DraggableProvided) => {
    const result = render(provided)
    const style = provided.draggableProps.style as DraggingStyle
    if (style.position === 'fixed') {
      return createPortal(result, element)
    }
    return result
  }
}
