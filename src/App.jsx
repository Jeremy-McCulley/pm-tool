import React, { useState } from 'react';
// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
// UI Components
import Modal from './components/UI/Modal';
import Button from './components/UI/Button';
import ProjectForm from './components/Project/ProjectForm';
// Main Views
import ProjectList from './components/Project/ProjectList'; // ProjectList.jsx is needed
import KanbanBoard from './components/Kanban/KanbanBoard'; 
import TaskForm from './components/Task/TaskForm'; // TaskForm.jsx is needed
// Icons
import { FiPlus } from 'react-icons/fi';

/**
 * Core application logic and view switching based on project selection.
 */
const AppContent = () => {
  const { 
    selectedProject, 
    clearSelectedProject, 
    selectProject,
    tasks, // All tasks for the selected project, filtered in ProjectContext
    dbServices 
  } = useProject();
  
  // --- State Management ---
  
  // Modal visibility
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  // Data passed to modals for editing (null if creating)
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [initialTaskStage, setInitialTaskStage] = useState(null); // Stage for new tasks


  // --- Project Modal Handlers ---
  
  const handleOpenCreateProject = () => {
    setProjectToEdit(null);
    setIsProjectModalOpen(true);
  };

  const handleOpenEditProject = (project) => {
    setProjectToEdit(project);
    setIsProjectModalOpen(true);
  };
  
  const handleProjectModalClose = () => {
    setProjectToEdit(null);
    setIsProjectModalOpen(false);
  };

  // --- Task Modal Handlers ---
  
  const handleOpenCreateTask = (stage) => {
    setTaskToEdit(null);
    setInitialTaskStage(stage); // Set the stage the task is being created in
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTask = (task) => {
    setTaskToEdit(task);
    setInitialTaskStage(null); // Not needed when editing
    setIsTaskModalOpen(true);
  };
  
  const handleTaskModalClose = () => {
    setTaskToEdit(null);
    setInitialTaskStage(null);
    setIsTaskModalOpen(false);
  };


  // --- Render Logic ---
  
  // View 1: Kanban Board (if a project is selected)
  if (selectedProject) {
    return (
      <>
        <KanbanBoard 
          project={selectedProject}
          tasks={tasks} // Tasks for the selected project
          onBack={clearSelectedProject}
          
          // CRUD handlers passed to KanbanColumn/TaskCard
          onUpdateTaskStage={dbServices.updateTaskStage}
          onAddTask={handleOpenCreateTask}
          onEditTask={handleOpenEditTask}
          onDeleteTask={dbServices.deleteTask}
        />
        
        {/* Task Form Modal for Kanban View */}
        <Modal 
          isOpen={isTaskModalOpen} 
          onClose={handleTaskModalClose} 
          title={taskToEdit ? 'Edit Task' : `New Task for ${selectedProject.name}`}
        >
          {/* Component: TaskForm.jsx (Still needs to be generated) */}
          <TaskForm 
            project={selectedProject}
            taskToEdit={taskToEdit}
            initialStage={initialTaskStage}
            onSave={handleTaskModalClose}
            dbServices={dbServices}
          />
        </Modal>
      </>
    );
  }

  // View 2: Project List (Default view)
  return (
    <div className="p-6 h-full">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-800">Your Projects</h1>
        <Button 
          variant="primary" 
          onClick={handleOpenCreateProject} 
          className="shadow-xl"
        >
          <FiPlus size={20} className="mr-1" />
          Create New Project
        </Button>
      </div>

      {/* Component: ProjectList.jsx (Still needs to be generated) */}
      <ProjectList 
        onSelect={selectProject}
        onEdit={handleOpenEditProject}
        onDelete={dbServices.deleteProject}
        // Project list is retrieved from useProject() internally
      />
      
      {/* Project Form Modal for List View */}
      <Modal 
        isOpen={isProjectModalOpen} 
        onClose={handleProjectModalClose} 
        title={projectToEdit ? 'Edit Project Details' : 'Create New Project'}
      >
        <ProjectForm 
          projectToEdit={projectToEdit}
          onSave={handleProjectModalClose}
          onCancel={handleProjectModalClose}
          dbService={dbServices}
        />
      </Modal>
    </div>
  );
};

/**
 * Main application wrapper for context providers and structural elements.
 */
const App = () => {
    return (
        <div id="app-container" className="min-h-screen bg-gray-50 font-sans">
            <AppContent />
            {/* The modal root for React Portals (Modal.jsx) - CRITICAL */}
            <div id="modal-root"></div>
        </div>
    );
};

// Export the component wrapped in the necessary context providers
export default () => (
    <AuthProvider>
        <ProjectProvider>
            <App />
        </ProjectProvider>
    </AuthProvider>
);