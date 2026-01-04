# React DnD Provider Documentation

A powerful and flexible drag-and-drop library for React applications that provides a simple API for implementing drag-and-drop functionality with TypeScript support. 
Easily build sortable lists, Kanban boards, and multi-column drag-and-drop layouts.

## [Demo](https://maurya20.github.io/react-dnd-provider/)

## Installation

```bash
npm install react-dnd-provider
or
yarn add react-dnd-provider
```

## Quick Start

```jsx
import { DragDropContextProvider, Droppable, Draggable } from 'react-dnd-provider';

function App() {
  const handleDragEnd = (result) => {
    // Handle drag end logic
  };

  return (
    <DragDropContextProvider onDragEnd={handleDragEnd}>
      <Droppable droppableId="column-1">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            <Draggable draggableId="item-1" index={0}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  Drag me!
                </div>
              )}
            </Draggable>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContextProvider>
  );
}
```

## Core Components

### DragDropContextProvider

The root component that wraps your entire drag-and-drop area and handles all drag-and-drop events.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onDragEnd` | `(result: DropResult) => void` | Yes | Callback fired when a drag operation completes |
| `onDragStart` | `(start: DragStart) => void` | No | Callback fired when a drag operation begins |
| `onBeforeDragStart` | `(start: DragStart) => void` | No | Callback fired before drag operation starts (preparation phase) |
| `onDragUpdate` | `(update: DragUpdate) => void` | No | Callback fired during drag movement with position updates |
| `children` | `ReactNode` | Yes | The droppable areas and draggable items |

#### Event Objects

**DragStart**
```typescript
interface DragStart {
  draggableId: string;
  source: {
    droppableId: string;
    index: number;
  };
}
```

**DragUpdate**
```typescript
interface DragUpdate {
  draggableId: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  } | null;
}
```

**DropResult**
```typescript
interface DropResult {
  draggableId: string;
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  } | null;
}
```

### Droppable

A component that creates a drop zone where draggable items can be dropped.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `droppableId` | `string` | Yes | Unique identifier for the droppable area |
| `children` | `(provided: DroppableProvided) => ReactNode` | Yes | Render function that receives droppable props |

#### DroppableProvided

```typescript
interface DroppableProvided {
  innerRef: (element: HTMLElement | null) => void;
  droppableProps: {
    'data-rbd-droppable-context-id': string;
    'data-rbd-droppable-id': string;
  };
  placeholder: ReactElement | null;
}
```

### Draggable

A component that makes an element draggable.

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `draggableId` | `string` | Yes | Unique identifier for the draggable item |
| `index` | `number` | Yes | Position index within the droppable |
| `children` | `(provided: DraggableProvided) => ReactNode` | Yes | Render function that receives draggable props |

#### DraggableProvided

```typescript
interface DraggableProvided {
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: {
    'data-rbd-draggable-context-id': string;
    'data-rbd-draggable-id': string;
    style?: React.CSSProperties;
  };
  dragHandleProps: {
    'data-rbd-drag-handle-draggable-id': string;
    'data-rbd-drag-handle-context-id': string;
    'aria-describedby': string;
    role: string;
    tabIndex: number;
    draggable: boolean;
    onDragStart: (event: DragEvent) => void;
  } | null;
}
```

## Event Handling

### Lifecycle Events

1. **onBeforeDragStart**: Fired before drag begins - perfect for preparation tasks
2. **onDragStart**: Fired when drag operation starts
3. **onDragUpdate**: Fired continuously during drag with position updates
4. **onDragEnd**: Fired when drag completes - where you update your state

### Event Flow Example

```javascript
const handleBeforeDragStart = (start) => {
  console.log('Preparing to drag:', start.draggableId);
  // Set loading states, prepare UI feedback
};

const handleDragStart = (start) => {
  console.log('Drag started:', start);
  // Additional drag start logic
};

const handleDragUpdate = (update) => {
  console.log('Drag position:', update);
  // Real-time feedback during drag
};

const handleDragEnd = (result) => {
  // Handle the actual state update
  if (!result.destination) {
    return; // Dropped outside valid area
  }
  
  // Update your data structure
  const newItems = reorderItems(
    items,
    result.source.index,
    result.destination.index
  );
  setItems(newItems);
};
```

## TypeScript Support

The library provides full TypeScript support with exported types:

```typescript
import {
  DragDropContextProvider,
  Droppable,
  Draggable,
  DropResult,
  DragStart,
  DragUpdate,
  DroppableProvided,
  DraggableProvided
} from 'react-dnd-provider';
```

## Usage Examples

### JavaScript Example (JSX)

```jsx
import React, { useState } from 'react';
import { 
  DragDropContextProvider, 
  Droppable, 
  Draggable
} from 'react-dnd-provider';

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Design homepage mockup', priority: 'high', assignee: 'Alice' },
    'task-2': { id: 'task-2', content: 'Implement user authentication', priority: 'medium', assignee: 'Bob' },
    'task-3': { id: 'task-3', content: 'Set up database schema', priority: 'high', assignee: 'Charlie' },
    'task-4': { id: 'task-4', content: 'Write unit tests', priority: 'low', assignee: 'Diana' },
    'task-5': { id: 'task-5', content: 'Deploy to staging', priority: 'medium', assignee: 'Eve' },
    'task-6': { id: 'task-6', content: 'Code review', priority: 'high', assignee: 'Frank' },
  },
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      color: '#ffebee',
      taskIds: ['task-1', 'task-2']
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      color: '#e3f2fd',
      taskIds: ['task-3', 'task-4']
    },
    'review': {
      id: 'review',
      title: 'Review',
      color: '#f3e5f5',
      taskIds: ['task-5']
    },
    'done': {
      id: 'done',
      title: 'Done',
      color: '#e8f5e8',
      taskIds: ['task-6']
    }
  },
  columnOrder: ['todo', 'in-progress', 'review', 'done']
};

const App = () => {
  const [data, setData] = useState(initialData);
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedTask: null,
    sourceColumn: null
  });

  const handleBeforeDragStart = (start) => {
    console.log('🚀 [onBeforeDragStart] Preparing to drag:', start);
    
    const task = data.tasks[start.draggableId];
    const sourceColumn = start.source.droppableId;
    
    setDragState({
      isDragging: true,
      draggedTask: task,
      sourceColumn
    });

    // Visual feedback
    document.body.style.cursor = 'grabbing';
    
    // Analytics or preparation logic
    console.log(`Preparing to move "${task.content}" from ${sourceColumn}`);
  };

  const handleDragUpdate = (update) => {
    console.log('📍 [onDragUpdate] Drag position updated:', update);
    
    const { draggableId, source, destination } = update;
    const task = data.tasks[draggableId];
    
    if (destination) {
      const sourceCol = data.columns[source.droppableId];
      const destCol = data.columns[destination.droppableId];
      
      console.log(`Moving "${task.content}" from ${sourceCol.title} to ${destCol.title} at position ${destination.index}`);
      
      // Show live preview feedback
      if (source.droppableId !== destination.droppableId) {
        console.log(`🔄 Cross-column move detected: ${sourceCol.title} → ${destCol.title}`);
      }
    } else {
      console.log('❌ Dragging outside valid drop zone');
    }
  };

  const handleDragEnd = (result) => {
    console.log('🏁 [onDragEnd] Drag completed:', result);
    
    // Reset drag state
    setDragState({
      isDragging: false,
      draggedTask: null,
      sourceColumn: null
    });
    
    document.body.style.cursor = '';
    
    const { destination, source, draggableId } = result;
    
    // Check if dropped outside valid area
    if (!destination) {
      console.log('❌ Dropped outside valid area - no changes made');
      return;
    }
    
    // Check if position actually changed
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      console.log('↩️ Dropped in same position - no changes needed');
      return;
    }
    
    // Update state
    setData(prevData => {
      const newData = { ...prevData };
      const task = newData.tasks[draggableId];
      
      // Handle reordering within the same column
      if (source.droppableId === destination.droppableId) {
        const column = { ...newData.columns[source.droppableId] };
        column.taskIds = [...column.taskIds];
        
        // Remove from source position
        column.taskIds.splice(source.index, 1);
        // Insert at destination position
        column.taskIds.splice(destination.index, 0, draggableId);
        
        newData.columns = {
          ...newData.columns,
          [source.droppableId]: column
        };
        
        console.log(`✅ Reordered "${task.content}" within ${column.title || source.droppableId} from position ${source.index} to ${destination.index}`);
      } else {
        // Handle moving between different columns
        // Remove from source
        const sourceColumn = { ...newData.columns[source.droppableId] };
        sourceColumn.taskIds = [...sourceColumn.taskIds];
        sourceColumn.taskIds.splice(source.index, 1);
        
        // Add to destination
        const destColumn = { ...newData.columns[destination.droppableId] };
        destColumn.taskIds = [...destColumn.taskIds];
        destColumn.taskIds.splice(destination.index, 0, draggableId);
        
        newData.columns = {
          ...newData.columns,
          [source.droppableId]: sourceColumn,
          [destination.droppableId]: destColumn
        };
        
        console.log(`✅ Successfully moved "${task.content}" from ${sourceColumn.title || source.droppableId} to ${destColumn.title || destination.droppableId}`);
      }
      
      return newData;
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        JavaScript Multi-Column Task Board
      </h1>
      
      {/* Drag Status Indicator */}
      {dragState.isDragging && dragState.draggedTask && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          fontSize: '14px',
          fontWeight: '500'
        }}>
          🚚 Moving: {dragState.draggedTask.content}
          <br />
          <small>From: {data.columns[dragState.sourceColumn]?.title}</small>
        </div>
      )}

      <DragDropContextProvider
        onBeforeDragStart={handleBeforeDragStart}
        onDragUpdate={handleDragUpdate}
        onDragEnd={handleDragEnd}
      >
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          overflowX: 'auto',
          paddingBottom: '20px'
        }}>
          {data.columnOrder.map(columnId => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map(taskId => data.tasks[taskId]);
            
            return (
              <div key={column.id} style={{ minWidth: '280px' }}>
                <h3 style={{ 
                  margin: '0 0 15px 0', 
                  padding: '12px',
                  textAlign: 'center',
                  backgroundColor: column.color,
                  borderRadius: '8px 8px 0 0',
                  border: '2px solid #ddd',
                  borderBottom: 'none',
                  color: '#333',
                  fontWeight: '600'
                }}>
                  {column.title}
                  <span style={{ 
                    marginLeft: '8px',
                    fontSize: '12px',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {column.taskIds.length}
                  </span>
                </h3>
                
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        backgroundColor: column.color,
                        borderRadius: '0 0 8px 8px',
                        padding: '15px',
                        minHeight: '300px',
                        border: '2px solid #ddd',
                        borderTop: 'none',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      {tasks.map((task, index) => (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...(provided.dragHandleProps || {})}
                              style={{
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '12px',
                                border: '2px solid #e0e0e0',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                cursor: 'grab',
                                userSelect: 'none',
                                transition: 'all 0.2s ease',
                                ...(provided.draggableProps?.style || {})
                              }}
                            >
                              <div style={{ marginBottom: '10px' }}>
                                <div style={{ 
                                  fontWeight: '600', 
                                  marginBottom: '8px',
                                  color: '#333',
                                  lineHeight: '1.4'
                                }}>
                                  {task.content}
                                </div>
                                <div style={{ 
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  fontSize: '12px',
                                  color: '#666'
                                }}>
                                  <span style={{ 
                                    backgroundColor: '#f5f5f5',
                                    padding: '2px 8px',
                                    borderRadius: '12px'
                                  }}>
                                    👤 {task.assignee}
                                  </span>
                                  <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}>
                                    <div style={{
                                      width: '8px',
                                      height: '8px',
                                      borderRadius: '50%',
                                      backgroundColor: getPriorityColor(task.priority)
                                    }} />
                                    {task.priority.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContextProvider>
      
      {/* Footer with event log info */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <strong>Event Handlers Active:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><code>onBeforeDragStart</code> - Prepares drag state & visual feedback</li>
          <li><code>onDragUpdate</code> - Tracks real-time drag position</li>
          <li><code>onDragEnd</code> - Handles final drop and state updates</li>
        </ul>
        <small>Check console for detailed event logs during drag operations.</small>
      </div>
    </div>
  );
};

export default App;
```

### TypeScript Example (TSX)

```tsx
import React, { useState } from 'react';
import { 
  DragDropContextProvider, 
  Droppable, 
  Draggable,
  DropResult,
  DragStart,
  DragUpdate 
} from 'react-dnd-provider';

interface Task {
  id: string;
  content: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  taskIds: string[];
}

interface AppState {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

const initialData: AppState = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Design homepage mockup', priority: 'high', assignee: 'Alice' },
    'task-2': { id: 'task-2', content: 'Implement user authentication', priority: 'medium', assignee: 'Bob' },
    'task-3': { id: 'task-3', content: 'Set up database schema', priority: 'high', assignee: 'Charlie' },
    'task-4': { id: 'task-4', content: 'Write unit tests', priority: 'low', assignee: 'Diana' },
    'task-5': { id: 'task-5', content: 'Deploy to staging', priority: 'medium', assignee: 'Eve' },
    'task-6': { id: 'task-6', content: 'Code review', priority: 'high', assignee: 'Frank' },
  },
  columns: {
    'todo': {
      id: 'todo',
      title: 'To Do',
      color: '#ffebee',
      taskIds: ['task-1', 'task-2']
    },
    'in-progress': {
      id: 'in-progress',
      title: 'In Progress',
      color: '#e3f2fd',
      taskIds: ['task-3', 'task-4']
    },
    'review': {
      id: 'review',
      title: 'Review',
      color: '#f3e5f5',
      taskIds: ['task-5']
    },
    'done': {
      id: 'done',
      title: 'Done',
      color: '#e8f5e8',
      taskIds: ['task-6']
    }
  },
  columnOrder: ['todo', 'in-progress', 'review', 'done']
};

const App: React.FC = () => {
  const [data, setData] = useState<AppState>(initialData);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    draggedTask: Task | null;
    sourceColumn: string | null;
  }>({
    isDragging: false,
    draggedTask: null,
    sourceColumn: null
  });

  const handleBeforeDragStart = (start: DragStart): void => {
    console.log('🚀 [onBeforeDragStart] Preparing to drag:', start);
    
    const task = data.tasks[start.draggableId];
    const sourceColumn = start.source.droppableId;
    
    setDragState({
      isDragging: true,
      draggedTask: task,
      sourceColumn
    });

    // Visual feedback
    document.body.style.cursor = 'grabbing';
    
    // Analytics or preparation logic
    console.log(`Preparing to move "${task.content}" from ${sourceColumn}`);
  };

  const handleDragUpdate = (update: DragUpdate): void => {
    console.log('📍 [onDragUpdate] Drag position updated:', update);
    
    const { draggableId, source, destination } = update;
    const task = data.tasks[draggableId];
    
    if (destination) {
      const sourceCol = data.columns[source.droppableId];
      const destCol = data.columns[destination.droppableId];
      
      console.log(`Moving "${task.content}" from ${sourceCol.title} to ${destCol.title} at position ${destination.index}`);
      
      // Show live preview feedback
      if (source.droppableId !== destination.droppableId) {
        console.log(`🔄 Cross-column move detected: ${sourceCol.title} → ${destCol.title}`);
      }
    } else {
      console.log('❌ Dragging outside valid drop zone');
    }
  };

  const handleDragEnd = (result: DropResult): void => {
    console.log('🏁 [onDragEnd] Drag completed:', result);
    
    // Reset drag state
    setDragState({
      isDragging: false,
      draggedTask: null,
      sourceColumn: null
    });
    
    document.body.style.cursor = '';
    
    const { destination, source, draggableId } = result;
    
    // Check if dropped outside valid area
    if (!destination) {
      console.log('❌ Dropped outside valid area - no changes made');
      return;
    }
    
    // Check if position actually changed
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      console.log('↩️ Dropped in same position - no changes needed');
      return;
    }
    
    // Update state
    setData(prevData => {
      const newData = { ...prevData };
      const task = newData.tasks[draggableId];
      
      // Handle reordering within the same column
      if (source.droppableId === destination.droppableId) {
        const column = { ...newData.columns[source.droppableId] };
        column.taskIds = [...column.taskIds];
        
        // Remove from source position
        column.taskIds.splice(source.index, 1);
        // Insert at destination position
        column.taskIds.splice(destination.index, 0, draggableId);
        
        newData.columns = {
          ...newData.columns,
          [source.droppableId]: column
        };
        
        console.log(`✅ Reordered "${task.content}" within ${column.title || source.droppableId} from position ${source.index} to ${destination.index}`);
      } else {
        // Handle moving between different columns
        // Remove from source
        const sourceColumn = { ...newData.columns[source.droppableId] };
        sourceColumn.taskIds = [...sourceColumn.taskIds];
        sourceColumn.taskIds.splice(source.index, 1);
        
        // Add to destination
        const destColumn = { ...newData.columns[destination.droppableId] };
        destColumn.taskIds = [...destColumn.taskIds];
        destColumn.taskIds.splice(destination.index, 0, draggableId);
        
        newData.columns = {
          ...newData.columns,
          [source.droppableId]: sourceColumn,
          [destination.droppableId]: destColumn
        };
        
        console.log(`✅ Successfully moved "${task.content}" from ${sourceColumn.title || source.droppableId} to ${destColumn.title || destination.droppableId}`);
      }
      
      return newData;
    });
  };

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        TypeScript Multi-Column Task Board
      </h1>
      
      {/* Drag Status Indicator */}
      {dragState.isDragging && dragState.draggedTask && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          fontSize: '14px',
          fontWeight: '500'
        }}>
          🚚 Moving: {dragState.draggedTask.content}
          <br />
          <small>From: {data.columns[dragState.sourceColumn!]?.title}</small>
        </div>
      )}

      <DragDropContextProvider
        onBeforeDragStart={handleBeforeDragStart}
        onDragUpdate={handleDragUpdate}
        onDragEnd={handleDragEnd}
      >
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          overflowX: 'auto',
          paddingBottom: '20px'
        }}>
          {data.columnOrder.map(columnId => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map(taskId => data.tasks[taskId]);
            
            return (
              <div key={column.id} style={{ minWidth: '280px' }}>
                <h3 style={{ 
                  margin: '0 0 15px 0', 
                  padding: '12px',
                  textAlign: 'center',
                  backgroundColor: column.color,
                  borderRadius: '8px 8px 0 0',
                  border: '2px solid #ddd',
                  borderBottom: 'none',
                  color: '#333',
                  fontWeight: '600'
                }}>
                  {column.title}
                  <span style={{ 
                    marginLeft: '8px',
                    fontSize: '12px',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    padding: '2px 8px',
                    borderRadius: '12px'
                  }}>
                    {column.taskIds.length}
                  </span>
                </h3>
                
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        backgroundColor: column.color,
                        borderRadius: '0 0 8px 8px',
                        padding: '15px',
                        minHeight: '300px',
                        border: '2px solid #ddd',
                        borderTop: 'none',
                        transition: 'background-color 0.2s ease'
                      }}
                    >
                      {tasks.map((task, index) => (
                        <Draggable 
                          key={task.id} 
                          draggableId={task.id} 
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...(provided.dragHandleProps || {})}
                              style={{
                                backgroundColor: '#ffffff',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '12px',
                                border: '2px solid #e0e0e0',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                cursor: 'grab',
                                userSelect: 'none' as const,
                                transition: 'all 0.2s ease',
                                ...(provided.draggableProps?.style as React.CSSProperties || {})
                              }}
                            >
                              <div style={{ marginBottom: '10px' }}>
                                <div style={{ 
                                  fontWeight: '600', 
                                  marginBottom: '8px',
                                  color: '#333',
                                  lineHeight: '1.4'
                                }}>
                                  {task.content}
                                </div>
                                <div style={{ 
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  fontSize: '12px',
                                  color: '#666'
                                }}>
                                  <span style={{ 
                                    backgroundColor: '#f5f5f5',
                                    padding: '2px 8px',
                                    borderRadius: '12px'
                                  }}>
                                    👤 {task.assignee}
                                  </span>
                                  <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}>
                                    <div style={{
                                      width: '8px',
                                      height: '8px',
                                      borderRadius: '50%',
                                      backgroundColor: getPriorityColor(task.priority)
                                    }} />
                                    {task.priority.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContextProvider>
      
      {/* Footer with event log info */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#666'
      }}>
        <strong>Event Handlers Active:</strong>
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          <li><code>onBeforeDragStart</code> - Prepares drag state & visual feedback</li>
          <li><code>onDragUpdate</code> - Tracks real-time drag position</li>
          <li><code>onDragEnd</code> - Handles final drop and state updates</li>
        </ul>
        <small>Check console for detailed event logs during drag operations.</small>
      </div>
    </div>
  );
};

export default App;
```

## Best Practices

### 1. Always Handle Edge Cases

```javascript
const handleDragEnd = (result) => {
  // Check if dropped outside valid area
  if (!result.destination) {
    return;
  }
  
  // Check if position actually changed
  if (
    result.destination.droppableId === result.source.droppableId && 
    result.destination.index === result.source.index
  ) {
    return;
  }
  
  // Your reorder logic here
};
```

### 2. Proper State Management

- Use immutable updates when modifying state
- Handle same-column reordering differently from cross-column moves
- Always create new objects/arrays instead of mutating existing ones

### 3. Performance Optimization

```javascript
// Use React.memo for draggable items if they're complex
const TaskItem = React.memo(({ task, index }) => (
  <Draggable draggableId={task.id} index={index}>
    {/* your content */}
  </Draggable>
));

// Use stable keys for list items
{tasks.map((task, index) => (
  <TaskItem key={task.id} task={task} index={index} />
))}
```

### 4. Accessibility

The library automatically handles:
- Keyboard navigation
- Screen reader announcements
- ARIA attributes
- Focus management

### 5. Error Handling

```javascript
const handleDragEnd = (result) => {
  try {
    // Your drag end logic
    updateState(result);
  } catch (error) {
    console.error('Error handling drag end:', error);
    // Optionally show user feedback
  }
};
```

## Common Patterns

### Multi-Column Kanban Board
Perfect for project management tools, task tracking, and workflow visualization.

### Sortable Lists
Ideal for reorderable lists, priority queues, and custom ordering interfaces.

### Nested Drag and Drop
Supports complex hierarchical structures with proper event bubbling.

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License

### 🎨 Styling Notes
This library ships with no default styles

You control all layout and appearance

Always merge provided.draggableProps.style for smooth animations

### ⚙️ Requirements
React 16.8 or higher
Hooks enabled
