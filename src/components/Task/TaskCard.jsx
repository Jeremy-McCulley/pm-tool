import React from 'react';
import { Draggable } from "@hello-pangea/dnd";
import { Trash2, Edit } from 'lucide-react';

/**
 * Renders a draggable card for a single task.
 *
 * @param {object} props
 * @param {object} props.task - The task object.
 * @param {number} props.index - The index for the Draggable component.
 * @param {function} props.onEdit - Handler to open the task edit form.
 * @param {function} props.onDelete - Handler to delete the task.
 */
const TaskCard = ({ task, index, onEdit, onDelete }) => {
  
  // Use task color if defined, otherwise fall back to a default
  const cardColor = task.color || '#3b82f6';
  
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`taskCard ${snapshot.isDragging ? 'isDragging' : ''}`}
          style={{ 
            ...provided.draggableProps.style,
            borderLeft: `5px solid ${cardColor}`, // Highlight color on the side
          }}
        >
          {/* Card Content */}
          <div className="cardBody">
            <h4 className="cardTitle">{task.title}</h4>
            {task.description && (
              <p className="cardDescription">{task.description}</p>
            )}
          </div>
          
          {/* Actions */}
          <div className="cardActions">
            <button 
              onClick={() => onEdit(task)} 
              className="editButton" 
              aria-label="Edit Task"
            >
              <Edit size={16} />
            </button>
            <button 
              onClick={() => onDelete(task.id)} 
              className="deleteButton" 
              aria-label="Delete Task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;