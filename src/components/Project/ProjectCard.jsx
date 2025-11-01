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
    <div 
      className="rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.01] hover:shadow-lg flex flex-col justify-between"
      style={{ 
        backgroundColor: color, 
        color: textColor,
        border: `2px solid ${color === '#FFFFFF' || color === '#ffffff' ? '#e5e7eb' : color}`, // Add border for white cards
      }}
    >
      {/* Header and Title */}
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold leading-tight line-clamp-2" title={name}>
          {name}
        </h2>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(project)}
            className="p-2 rounded-full transition-colors duration-150 hover:bg-opacity-20"
            style={{ color: textColor, backgroundColor: `${textColor}1A` }} // 1A is 10% opacity
            aria-label={`Edit project ${name}`}
          >
            <FiEdit size={16} />
          </button>
          <button 
            onClick={() => onDelete(id)}
            className="p-2 rounded-full transition-colors duration-150 hover:bg-red-500 hover:text-white"
            style={{ color: textColor, backgroundColor: `${textColor}1A` }}
            aria-label={`Delete project ${name}`}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-6">
        <p className="text-sm opacity-90">
          <span className="font-semibold">{taskCount}</span> Tasks
        </p>
        <p className="text-sm opacity-90">
          <span className="font-semibold">{stageCount}</span> Kanban Stages
        </p>
      </div>

      {/* View Button */}
      <button 
        onClick={() => onView(id)}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 font-semibold rounded-lg transition duration-200 shadow-md transform hover:scale-[1.02]"
        style={{ 
          backgroundColor: textColor, 
          color: color, 
          border: `1px solid ${textColor}` 
        }}
      >
        <span>View Board</span>
        <FiArrowRight size={18} />
      </button>

    </div>
  );
};

export default ProjectCard;