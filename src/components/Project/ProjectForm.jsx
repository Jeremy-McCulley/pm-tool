import React, { useState, useEffect } from 'react';
import ColorPicker from '../UI/ColorPicker'; // Assuming the ColorPicker file is at '../UI/ColorPicker'

/**
 * Form for creating a new project or editing an existing one.
 * @param {object} props
 * @param {object | null} props.projectToEdit - The project object if editing, or null if creating.
 * @param {function} props.onSave - Callback function called on successful save/update.
 * @param {function} props.onCancel - Callback function to close the modal/form.
 * @param {object} props.dbService - CRUD service object (will be the imported dbServices object).
 */
const ProjectForm = ({ projectToEdit, onSave, onCancel, dbService }) => {
  const isEditing = !!projectToEdit;
  
  // Initialize state based on whether we are creating or editing
  const [name, setName] = useState(projectToEdit?.name || '');
  const [color, setColor] = useState(projectToEdit?.color || '#2980b9'); // Default blue
  const [stagesInput, setStagesInput] = useState(
    projectToEdit?.stages?.join(', ') || 'Todo, In Progress, Done'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    setError(null);
    
    // Convert the comma-separated stage string into a clean array
    const stagesArray = stagesInput
      .split(',')
      .map(stage => stage.trim())
      .filter(stage => stage.length > 0);

    if (stagesArray.length === 0) {
      setError('Please define at least one stage.');
      setIsLoading(false);
      return;
    }

    const projectData = {
      name: name.trim(),
      color,
      stages: stagesArray,
      createdAt: isEditing ? projectToEdit.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        // Use the updateProject function from the passed-in dbService
        await dbService.updateProject(projectToEdit.id, projectData);
      } else {
        // Use the createProject function from the passed-in dbService
        await dbService.createProject(projectData);
      }
      onSave(); // Close modal and refresh data
    } catch (err) {
      console.error('Project save error:', err);
      // In a real app, check error codes for permissions/network issues
      setError(`Failed to ${isEditing ? 'update' : 'create'} project. Check console for details.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditing ? 'Edit Project' : 'Create New Project'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project Name Input */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Q4 Marketing Campaign"
            required
            disabled={isLoading}
          />
        </div>

        {/* Project Stages Input */}
        <div>
          <label htmlFor="stages" className="block text-sm font-medium text-gray-700 mb-1">
            Kanban Stages (Comma-separated)
          </label>
          <input
            type="text"
            id="stages"
            value={stagesInput}
            onChange={(e) => setStagesInput(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Backlog, Design, Development, Review"
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500 mt-1">
            These will be your column headers on the board.
          </p>
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Color
          </label>
          <ColorPicker selectedColor={color} onChange={setColor} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors"
            disabled={isLoading}
          >
            {isLoading
              ? 'Saving...'
              : isEditing ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;