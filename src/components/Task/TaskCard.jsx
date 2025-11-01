import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

/**
 * Renders a single, draggable task card.
 * This component is intended to be rendered inside a Droppable component.
 *
 * @param {object} props
 * @param {object} props.task - The task object { id, title, description, color, projectId, stage, order }.
 * @param {number} props.index - The index of the task within its current list (required by Draggable).
 * @param {function} props.onEdit - Handler to open the task edit modal.
 * @param {function} props.onDelete - Handler to delete the task.
 * @param {string} props.projectColor - The main color of the parent project.
 */
const TaskCard = ({ task, index, onEdit, onDelete, projectColor }) => {
  const { id, title, description, color: taskColor = projectColor } = task;

  // Function to determine text color based on background color lightness (copied from ProjectCard)
  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#111827' : '#FFFFFF';
  };

  const textColor = getContrastColor(taskColor);
  const borderColor = taskColor;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white p-4 mb-3 rounded-xl shadow-md transition-all duration-200 cursor-pointer
            border-l-4
            ${snapshot.isDragging ? 'shadow-xl rotate-1' : 'hover:shadow-lg'}
          `}
          style={{ 
            ...provided.draggableProps.style,
            borderColor: borderColor, // Use the task or project color for the border highlight
          }}
        >
          {/* Color Indicator (Top Edge) - Optional, using border-l-4 instead */}

          {/* Card Content */}
          <h3 className="text-sm font-semibold mb-1 text-gray-800 line-clamp-2">
            {title}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 line-clamp-3 mb-3">
              {description}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-2 border-t border-gray-100 pt-2 -mx-4 px-4">
            <button
              onClick={() => onEdit(task)}
              className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label={`Edit task ${title}`}
            >
              <FiEdit size={14} />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors"
              aria-label={`Delete task ${title}`}
            >
              <FiTrash2 size={14} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;