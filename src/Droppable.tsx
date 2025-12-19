import React, { useContext, createContext, useRef, ReactNode, RefObject } from 'react';
import { DragDropContext } from './DragDropContext';

interface DroppableContextValue {
  droppableId: string;
}

export const DroppableContext = createContext<DroppableContextValue | null>(null);

interface DroppableProvided {
  droppableProps: { [key: string]: string };
  innerRef: RefObject<HTMLDivElement>;
  placeholder: ReactNode;
}

interface DroppableProps {
  droppableId: string;
  children: (provided: DroppableProvided) => ReactNode;
}

const Droppable: React.FC<DroppableProps> = ({ droppableId, children }) => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('Droppable must be used within a DragDropContextProvider');
  }
  const { onDragUpdate } = context;
  const droppableRef = useRef<HTMLDivElement>(null);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!droppableRef.current) {
      return;
    }

    const draggables = [
      //@ts-ignore
      ...droppableRef.current.querySelectorAll('[data-draggable-id]'),
    ] as HTMLElement[];
    const mouseY = e.clientY;
    let newIndex = draggables.length;

    for (let i = 0; i < draggables.length; i++) {
      const rect = draggables[i].getBoundingClientRect();
      if (mouseY < rect.top + rect.height / 2) {
        newIndex = i;
        break;
      }
    }

    if (onDragUpdate) {
      onDragUpdate({ destination: { droppableId, index: newIndex } });
    }
  };

  return (
    <DroppableContext.Provider value={{ droppableId }}>
      <div ref={droppableRef} onDragOver={onDragOver}>
        {children({
          droppableProps: {
            'data-droppable-id': droppableId,
          },
          //@ts-ignore
          innerRef: droppableRef,
          placeholder: null,
        })}
      </div>
    </DroppableContext.Provider>
  );
};

export default Droppable;
