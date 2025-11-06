import React from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from '../Task/TaskCard';
import { FiPlusCircle } from 'react-icons/fi';

/**
 * Renders a single Kanban column (stage) which acts as a Droppable area.
 *
 * @param {object} props
 * @param {string} props.stage - The name of the stage/column (e.g., "In Progress").
 * @param {Array<object>} props.tasks - The array of tasks currently in this stage.
 * @param {string} props.projectColor - The main color of the parent project for styling.
 * @param {function} props.onAddTask - Handler to open the task creation form for this stage.
 * @param {function} props.onEditTask - Handler to open the task edit form.
 * @param {function} props.onDeleteTask - Handler to delete a task.
 */
const KanbanColumn = ({ stage, tasks, projectColor, onAddTask, onEditTask, onDeleteTask }) => {
  return (
    <div className="mainTaskContainer">
      
      {/* Column Header */}
      <div className="taskHeader">
        <h3 className="taskTitle" style={{ borderBottom: `4px solid ${projectColor}` }}>
          {stage} ({tasks.length})
        </h3>
        <button onClick={() => onAddTask(stage)} className="addTaskBtn" aria-label={`Add task to ${stage}`}>
          <FiPlusCircle size={20} />
        </button>
      </div>

      {/* Droppable Area for Tasks */}
      <Droppable droppableId={stage}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className={`taskCardContainer ${snapshot.isDraggingOver ? 'bg-indigo-100/50' : ''}`}>
            {/* List of Task Cards */}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                projectColor={projectColor}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}

            {/* Placeholder to reserve space when empty */}
            {provided.placeholder} 

            {/* Empty State Message */}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <p className="text-sm text-gray-500 text-center py-4 select-none">
                Drag tasks here or click '+' to create one.
              </p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;