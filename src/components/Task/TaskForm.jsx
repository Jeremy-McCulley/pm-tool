import React, { useState } from 'react';
import Button from '../UI/Button'; 

const TaskForm = ({ project, taskToEdit, initialStage, onSave, dbServices }) => {
  const isEditing = !!taskToEdit;
  // CRITICAL FIX: Defensive destructuring: uses {} if project is null/undefined.
  const { id: projectId, stages = [], color: projectColor } = project || {};

  // Initialize state
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  // Default stage must use nullish coalescing to avoid errors if project or stages are undefined
  const [stage, setStage] = useState(taskToEdit?.stage || initialStage || stages[0] || 'Todo'); 
  const [color, setColor] = useState(taskToEdit?.color || projectColor || '#3b82f6'); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title cannot be empty.');
      return;
    }
    
    // Safety check: ensure we have a project ID before saving a new task
    if (!isEditing && !projectId) {
        setError('Cannot create task: Project information is missing.');
        return;
    }

    setIsLoading(true);
    setError(null);

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      stage: stage,
      color: color,
      projectId: projectId,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        await dbServices.updateTask(taskToEdit.id, taskData);
      } else {
        taskData.createdAt = new Date().toISOString();
        taskData.order = new Date().getTime(); 
        await dbServices.createTask(taskData);
      }
      onSave();
    } catch (err) {
      console.error('Task save error:', err);
      setError(`Failed to ${isEditing ? 'update' : 'create'} task. Please check the console.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Task Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="e.g., Implement Firebase integration"
          required
          disabled={isLoading}
        />
      </div>

      {/* Description Textarea */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description (Optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          placeholder="Detailed steps, links, or notes for the task."
          disabled={isLoading}
        />
      </div>
      
      {/* Stage Selector and Color Picker (Side-by-Side) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stage Selector */}
        <div>
          <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
            Stage / Column
          </label>
          {/* Ensure stages is an array before mapping */}
          <select
            id="stage"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            required
            disabled={isLoading}
          >
            {stages?.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Color Picker (using HTML input type="color") */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Task Color (Override)
          </label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-full h-10 rounded-lg border-0 cursor-pointer"
            title="Choose your task color"
            disabled={isLoading}
          />
        </div>
      </div>


      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          variant="secondary" 
          onClick={onSave}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {isEditing ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;