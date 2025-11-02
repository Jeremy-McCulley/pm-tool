import React from 'react';
import { useProject } from '../../contexts/ProjectContext';
import ProjectCard from './ProjectCard';
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';

/**
 * Displays the list of all projects and handles the loading/error states.
 * This component gets its data from ProjectContext.
 * @param {object} props
 * @param {function} props.onSelect - Passed to ProjectCard to select a project.
 * @param {function} props.onEdit - Passed to ProjectCard to edit a project.
 * @param {function} props.onDelete - Passed to ProjectCard to delete a project.
 */
const ProjectList = ({ onSelect, onEdit, onDelete }) => {
  const { projects, projectListLoading } = useProject();

  // --- Loading State ---
  if (projectListLoading) {
    return (
      <div className="">
        <FiLoader size={48} className="" />
        <p className="">Loading your projects...</p>
      </div>
    );
  }

  // --- Empty State ---
  if (projects.length === 0) {
    return (
      <div className="">
        <FiAlertTriangle className="" />
        <h2 className="">No Projects Found</h2>
        <p className="">Click the "Create New Project" button above to get started!</p>
      </div>
    );
  }

  // --- Success State (Grid View) ---
  return (
    <div className="">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProjectList;