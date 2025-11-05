import React from 'react';
import { useProject } from '../../contexts/ProjectContext';
import ProjectCard from './ProjectCard';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';

const ProjectList = ({ onSelect, onEdit, onDelete }) => {
  const { projects, projectListLoading } = useProject();

  if (projectListLoading) {
    return (
      <div className="">
        <FiLoader size={48} className="" />
        <p className="">Loading your projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="noProjectFound">
        <FiAlertTriangle className="" />
        <h2 className="">No Projects Found</h2>
        <p className="">Click the "Create New Project" button above to get started!</p>
      </div>
    );
  }

  return (
    <div className="singleProjectContainer">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onView={() => onSelect(project)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProjectList;