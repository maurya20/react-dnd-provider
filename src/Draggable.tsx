import React, { useContext, ReactNode, RefObject } from 'react';
import { DragDropContext } from './DragDropContext';
import { DroppableContext } from './Droppable';

interface DraggableProvided {
  draggableProps: { [key: string]: string | object };
  dragHandleProps: null;
  innerRef: RefObject<HTMLDivElement>;
}

interface DraggableProps {
  draggableId: string;
  index: number;
  children: (provided: DraggableProvided) => ReactNode;
}

const Draggable: React.FC<DraggableProps> = ({ draggableId, index, children }) => {
  const dndContext = useContext(DragDropContext);
  const droppableContext = useContext(DroppableContext);

  if (!dndContext || !droppableContext) {
    throw new Error('Draggable must be used within a DragDropContextProvider and a Droppable');
  }

  const { onDragStart, onDragEnd } = dndContext;
  const { droppableId } = droppableContext;

  const onDragStartHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', draggableId);
    if (onDragStart) {
      onDragStart({ draggableId, source: { droppableId, index } });
    }
  };

  const onDragEndHandler = () => {
    if (onDragEnd) {
      onDragEnd();
    }
  };

  return (
    <div
      ref={(ref) => {
        if (ref) {
          ref.setAttribute('data-draggable-id', draggableId);
        }
      }}
      draggable
      onDragStart={onDragStartHandler}
      onDragEnd={onDragEndHandler}
    >
      {children({
        draggableProps: {
          'data-draggable-id': draggableId,
          style: {},
        },
        dragHandleProps: null,
        //@ts-ignore
        innerRef: React.createRef<HTMLDivElement>(),
      })}
    </div>
  );
};

export default Draggable;
