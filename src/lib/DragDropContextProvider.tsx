import React, { createContext, useState, ReactNode } from 'react';


// Internal type for context communication
interface InternalDragUpdate {
  destination?: DraggableLocation;
}

interface DragDropContextValue {
  onDragStart: (start: DragStart) => void;
  onDragUpdate: (update: InternalDragUpdate) => void;
  onDragEnd: () => void;
}

export const DragDropContext = createContext<DragDropContextValue | null>(null);

export interface DragStart {
  draggableId: string;
  source: DraggableLocation;
}

// User-facing type for onDragUpdate prop
export interface DragUpdate {
  draggableId: string;
  source: DraggableLocation;
  destination?: DraggableLocation;
}

export interface DraggableLocation {
  droppableId: string;
  index: number;
}

export interface DropResult {
  draggableId: string;
  source: DraggableLocation;
  destination?: DraggableLocation;
}

interface DragDropContextProviderProps {
  children: ReactNode;
  onDragEnd: (result: DropResult) => void;
  onDragUpdate?: (update: DragUpdate) => void;
  onBeforeDragStart?: (start: DragStart) => void;
}

const DragDropContextProvider: React.FC<DragDropContextProviderProps> = ({
  children,
  onDragEnd,
  onDragUpdate: onDragUpdateProp,
  onBeforeDragStart,
}) => {
  const [draggableId, setDraggableId] = useState<string | null>(null);
  const [source, setSource] = useState<DraggableLocation | null>(null);
  const [destination, setDestination] = useState<DraggableLocation | null>(null);

  const onDragStart = (start: DragStart) => {
    if (onBeforeDragStart) {
      onBeforeDragStart(start);
    }
    setDraggableId(start.draggableId);
    setSource(start.source);
  };

  const onDragUpdate = (update: InternalDragUpdate) => {
    if (onDragUpdateProp && draggableId && source) {
      // Combine internal update with state to form the complete user-facing update
      onDragUpdateProp({
        draggableId,
        source,
        destination: update.destination,
      });
    }
    setDestination(update.destination ?? null);
  };

  const handleDragEnd = () => {
    if (onDragEnd && draggableId && source) {
      onDragEnd({
        draggableId,
        source,
        destination: destination ?? undefined,
      });
    }
    setDraggableId(null);
    setSource(null);
    setDestination(null);
  };

  const value: DragDropContextValue = {
    onDragStart,
    onDragUpdate,
    onDragEnd: handleDragEnd,
  };

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
};
// Export as both named and default
export { DragDropContextProvider };
export default DragDropContextProvider;
