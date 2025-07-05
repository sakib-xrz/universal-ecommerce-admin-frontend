import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { forwardRef, useContext, createContext } from "react";

// Create a context to pass drag handlers
export const DragHandleContext = createContext();

const DraggableRow = forwardRef(({ children, ...props }, ref) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 9999 : "auto",
  };

  const dragHandlers = {
    ...attributes,
    ...listeners,
    ref: setNodeRef,
  };

  return (
    <DragHandleContext.Provider value={dragHandlers}>
      <tr {...props} ref={ref} style={style}>
        {children}
      </tr>
    </DragHandleContext.Provider>
  );
});

DraggableRow.displayName = "DraggableRow";

export default DraggableRow;
