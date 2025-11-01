import React from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import KanbanColumn from "./Task/KanbanColumn.jsx";
import { FiArrowLeft } from 'react-icons/fi';

/**
 * The main container for the Kanban board, handling the drag-and-drop logic.
 *
 * @param {object} props
 * @param {object} props.project - The currently selected project object { id, name, color, stages }.
 * @param {Array<object>} props.tasks - The array of all tasks belonging to this project.
 * @param {function} props.onBack - Handler to return to the project list view.
 * @param {function} props.onUpdateTaskStage - Function from dbService to update a task's stage in Firebase.
 * @param {function} props.onAddTask - Handler to open the task creation form.
 * @param {function} props.onEditTask - Handler to open the task edit form.
 * @param {function} props.onDeleteTask - Handler to delete a task.
 */
const KanbanBoard = ({ 
    project, 
    tasks, 
    onBack, 
    onUpdateTaskStage,
    onAddTask,
    onEditTask,
    onDeleteTask
}) => {
  
  const { stages = [], name, color } = project;

  // --- Task Reordering and Stage Change Logic ---
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // 1. Dropped outside of a droppable area (or result is incomplete)
    if (!destination) {
      return;
    }

    // 2. Dropped back into the original column at the same index (no change)
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // --- State Update Logic ---
    
    const startStage = source.droppableId;
    const endStage = destination.droppableId;
    const taskId = draggableId;
    
    // NOTE: In a complex real-world app, you would update the local React state here
    // for instant feedback, then call the Firebase update. Since we are using
    // onSnapshot, the update will eventually come back from Firebase.
    
    if (startStage === endStage) {
      // 3. Moving within the same column
      console.log(`Task ${taskId} moved within stage ${startStage}`);
      // In a real app, you would call a function here to update the 'order' field of all tasks in the stage.
      // For simplicity in this implementation, we will skip updating the internal order for now.
      return;
    } else {
      // 4. Moving to a different column (Stage Change)
      console.log(`Task ${taskId} moved from ${startStage} to ${endStage}`);
      
      // Call the Firebase service function to update the task's stage property
      // We assume onUpdateTaskStage handles the async Firestore call
      onUpdateTaskStage(taskId, endStage);
    }
  };
  
  // --- Task Grouping ---
  // Group tasks by their current 'stage' field for rendering
  const tasksByStage = stages.reduce((acc, stage) => {
    acc[stage] = tasks.filter(task => task.stage === stage).sort((a, b) => a.order - b.order);
    return acc;
  }, {});


  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
            <button 
                onClick={onBack} 
                className="p-2 mr-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Back to project list"
            >
                <FiArrowLeft size={24} />
            </button>
            {name}
        </h1>
        <div 
            className="text-sm font-semibold px-3 py-1 rounded-full text-white"
            style={{ backgroundColor: color }}
        >
            Project ID: {project.id}
        </div>
      </div>
      
      {/* Kanban Columns Container */}
      {/* DragDropContext is the mandatory wrapper for all D&D functionality */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-4 overflow-x-auto pb-4 flex-grow">
          
          {stages.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              tasks={tasksByStage[stage] || []}
              projectColor={color}
              // Pass down task handlers for this column
              onAddTask={onAddTask}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}

          {/* Add a space at the end */}
          <div className="w-4 flex-shrink-0"></div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanBoard;