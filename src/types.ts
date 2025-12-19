export type DraggableId = string;
export type DroppableId = string;

export interface DraggableLocation {
  droppableId: DroppableId;
  index: number;
}

export interface DropResult {
  draggableId: DraggableId;
  source: DraggableLocation;
  destination?: DraggableLocation | null;
}

export interface DragStart {
  draggableId: DraggableId;
  source: DraggableLocation;
}

export type OnDragStart = (start: DragStart) => void;
export type OnDragEnd = (result: DropResult) => void;
