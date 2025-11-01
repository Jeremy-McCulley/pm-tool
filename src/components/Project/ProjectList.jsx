import React from 'react';
import { useProject } from '../../contexts/ProjectContext';
import ProjectCard from './ProjectCard'; // Needs ProjectCard.jsx
import { FiLoader, FiAlertTriangle } from 'react-icons/fi';

/**
 * Displays the list of all projects and handles the loading/error states.
 * This component gets its data from ProjectContext.
 * * @param {object} props
 * @param {function} props.onSelect - Passed to ProjectCard to select a project.
 * @param {function} props.onEdit - Passed to ProjectCard to edit a project.
 * @param {function} props.onDelete - Passed to ProjectCard to delete a project.
 */
const ProjectList = ({ onSelect, onEdit, onDelete }) => {
  const { projects, projectListLoading } = useProject();

  // --- Loading State ---
  if (projectListLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <FiLoader size={48} className="animate-spin text-indigo-500 mb-4" />
        <p className="text-lg font-medium">Loading your projects...</p>
      </div>
    );
  }

  // --- Empty State ---
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
        <FiAlertTriangle size={48} className="mb-4 text-indigo-400" />
        <h2 className="text-xl font-semibold mb-2">No Projects Found</h2>
        <p className="text-md">Click the "Create New Project" button above to get started!</p>
      </div>
    );
  }

  // --- Success State (Grid View) ---
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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