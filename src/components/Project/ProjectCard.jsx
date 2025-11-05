import React from 'react';
import { FiEdit, FiTrash2, FiArrowRight } from 'react-icons/fi';

const ProjectCard = ({ project, onView, onEdit, onDelete }) => {
  const { id, name, color, taskCount = 0, stageCount = 3 } = project;
  
  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#111827' : '#FFFFFF';
  };
  
  const textColor = getContrastColor(color);

  const cardStyle = {
    backgroundColor: color,
    color: textColor,
  };

  const viewButtonStyle = {
    color: color, 
    borderColor: color, 
  };
  
  return (
    <div className="singleProjectItem" style={cardStyle}>
      {/* Header and Title */}
      <div className="">
        <h2 className="" title={name}>{name}</h2>
        {/* Action Buttons */}
        <div className="editDelBtnContainer">
          <button onClick={() => onEdit(project)} className="" aria-label={`Edit project ${name}`}>
            <FiEdit style={{ color: textColor }} />
          </button>
          <button onClick={() => onDelete(id)} className="" aria-label={`Delete project ${name}`}>
            <FiTrash2 size={16} style={{ color: textColor }} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="taskProjectCounterContainer">
        <p className="">
          <span className="">{taskCount}</span> Tasks
        </p>
        <p className="">
          <span className="">{stageCount}</span> Project Stages
        </p>
      </div>

      {/* View Button */}
      <button 
        onClick={() => onView(project)} 
        className="viewBtn"
        style={viewButtonStyle}>
        <span>View Board</span>
        <FiArrowRight />
      </button>

    </div>
  );
};

export default ProjectCard;