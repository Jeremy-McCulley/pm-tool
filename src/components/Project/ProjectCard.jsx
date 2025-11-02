import React from 'react';
import { FiEdit, FiTrash2, FiArrowRight } from 'react-icons/fi';
/**
 * Renders a summary card for a single project.
 *
 * @param {object} props
 * @param {object} props.project - The project object { id, name, color, taskCount, stageCount }.
 * @param {function} props.onView - Handler to navigate to the Kanban board.
 * @param {function} props.onEdit - Handler to open the project edit modal.
 * @param {function} props.onDelete - Handler to delete the project.
 */
const ProjectCard = ({ project, onView, onEdit, onDelete }) => {
  const { id, name, color, taskCount = 0, stageCount = 3 } = project;
  // Function to determine text color based on background color lightness
  const getContrastColor = (hexColor) => {
    // Basic conversion of hex to RGB (simplified)
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    // Calculate relative luminance (W3C standard)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    // Return black for bright colors, white for dark colors
    return luminance > 0.5 ? '#111827' : '#FFFFFF'; // dark gray or white
  };
  const textColor = getContrastColor(color);
  return (
    <div className="">
      {/* Header and Title */}
      <div className="">
        <h2 className="" title={name}>{name}</h2>
        {/* Action Buttons */}
        <div className="">
          <button onClick={() => onEdit(project)} className="" aria-label={`Edit project ${name}`}>
            <FiEdit />
          </button>
          <button onClick={() => onDelete(id)} className="" aria-label={`Delete project ${name}`}>
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="">
        <p className="">
          <span className="">{taskCount}</span> Tasks
        </p>
        <p className="">
          <span className="">{stageCount}</span> Project Stages
        </p>
      </div>

      {/* View Button */}
      <button 
        onClick={() => onView(id)} className="">
        <span>View Board</span>
        <FiArrowRight />
      </button>

    </div>
  );
};

export default ProjectCard;