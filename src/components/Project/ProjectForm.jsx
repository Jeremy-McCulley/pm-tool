import React, { useState, useEffect } from 'react';
import ColorPicker from '../UI/ColorPicker';
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
        await dbService.updateProject(projectToEdit.id, projectData);
      } else {
        await dbService.createProject(projectData);
      }
      onSave();
    } catch (err) {
      console.error('Project save error:', err);
      // In a real app, check error codes for permissions/network issues
      setError(`Failed to ${isEditing ? 'update' : 'create'} project. Check console for details.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <h2 className="">{isEditing ? 'Edit Project' : 'Create New Project'}</h2>
      {error && (
        <div className="" role="alert"><span className="">{error}</span></div>
      )}
      <form onSubmit={handleSubmit} className="">
        {/* Project Name Input */}
        <div>
          <label htmlFor="name" className="">Project Name</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="" placeholder="e.g., Q4 Marketing Campaign" required disabled={isLoading} />
        </div>

        {/* Project Stages Input */}
        <div>
          <label htmlFor="stages" className="">Project Stages (Comma-separated)</label>
          <input type="text" id="stages" value={stagesInput} onChange={(e) => setStagesInput(e.target.value)} className="" placeholder="e.g., Backlog, Design, Development, Review" required disabled={isLoading} />
          <p className="">These will be your column headers on the board.</p>
        </div>

        {/* Color Picker */}
        <div>
          <label className="">
            Project Color
          </label>
          <ColorPicker selectedColor={color} onChange={setColor} />
        </div>

        {/* Action Buttons */}
        <div className="">
          <button type="button" onClick={onCancel} className="" disabled={isLoading}>
            Cancel
          </button>
          <button type="submit" className="" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;