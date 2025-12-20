# react-dnd-provider

A lightweight and flexible drag-and-drop provider for React.  
Easily build sortable lists, Kanban boards, and multi-column drag-and-drop layouts.

---

## ✨ Features

- Simple and intuitive API
- Supports multiple droppable areas
- Drag items within and across lists
- Fully controlled drag state via `onDragEnd`
- Familiar render-prop pattern
- Unstyled by default (full styling control)

---

## 📦 Installation

npm install react-dnd-provider
or
yarn add react-dnd-provider



## 🚀 Usage Example
jsx
```
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-dnd-provider';

const App = () => {
  const [columns, setColumns] = useState({
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      items: [
        { id: 'item-1', content: 'Task 1' },
        { id: 'item-2', content: 'Task 2' },
      ],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      items: [{ id: 'item-3', content: 'Task 3' }],
    },
    'column-3': {
      id: 'column-3',
      title: 'Done',
      items: [{ id: 'item-4', content: 'Task 4' }],
    },
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    const sourceItems = Array.from(sourceColumn.items);
    const destItems = Array.from(destColumn.items);

    const [removed] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
      });
    } else {
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        {Object.values(columns).map((column) => (
          <Droppable key={column.id} droppableId={column.id}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  padding: 16,
                  width: 250,
                  backgroundColor: '#f4f4f4',
                  border: '1px solid #ccc',
                }}
              >
                <h3>{column.title}</h3>

                {column.items.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: 'none',
                          padding: 16,
                          marginBottom: 8,
                          backgroundColor: '#fff',
                          border: '1px solid #ddd',
                          ...provided.draggableProps.style,
                        }}
                      >
                        {item.content}
                      </div>
                    )}
                  </Draggable>
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
};

export default App;

```
### 🧩 API Reference
<DragDropContext /> Wraps your drag-and-drop UI.

onDragEnd	function	Called when a drag action ends

<Droppable /> Defines a droppable area.

<Draggable /> Defines a draggable item.


### 📌 onDragEnd Result Object
```
{
  source: {
    droppableId: string,
    index: number
  },
  destination: {
    droppableId: string,
    index: number
  } | null
}
```
destination will be null if the item is dropped outside a droppable area.

### 🎨 Styling Notes
This library ships with no default styles

You control all layout and appearance

Always merge provided.draggableProps.style for smooth animations

### ⚙️ Requirements
React 16.8 or higher

Hooks enabled
