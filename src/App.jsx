import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
import dbServices from './firebase/dbServices';
import { db, auth, app, setupAuth } from './firebase/firebaseConfig';

// --- Icons ---
import { Plus, ListChecks, LayoutDashboard, LogOut, Home, X, AlertTriangle } from 'lucide-react';

// --- Components ---
import ProjectForm from './components/Project/ProjectForm';
import ProjectList from './components/Project/ProjectList';
import TaskForm from './components/Task/TaskForm';
import KanbanBoard from './components/KanbanBoard';

// --- Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-75 flex items-center justify-center p-4 transition-opacity duration-300">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100"
        onClick={e => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// --- Header Component ---
const Header = ({ projectName, view, setView, onOpenForm, onSignOut }) => {
  const { userId } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-extrabold text-indigo-600 flex items-center">
            <ListChecks className="w-6 h-6 mr-2" />
            Task Flow
          </h1>
          {projectName && (
            <span className="text-xl font-medium text-gray-700 ml-4 border-l pl-4 border-gray-300">
              {projectName}
            </span>
          )}
        </div>

        <nav className="flex items-center space-x-4">
          {projectName && (
            <>
              <button
                onClick={() => setView('board')}
                className={`flex items-center px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  view === 'board' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Board
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex items-center px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  view === 'list' ? 'bg-indigo-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Projects
              </button>
            </>
          )}

          {!projectName && view === 'list' && (
            <button
              onClick={() => onOpenForm('project')}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </button>
          )}
          {projectName && view === 'board' && (
            <button
              onClick={() => onOpenForm('task')}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </button>
          )}

          {userId && (
            <span className="text-xs text-gray-500 truncate mr-4" title="Your User ID">
              User: {userId}
            </span>
          )}
          <button
            onClick={onSignOut}
            className="flex items-center text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50 text-sm"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 mr-1" />
            Exit
          </button>
        </nav>
      </div>
    </header>
  );
};

// --- Main App Content ---
const AppContent = () => {
  const { onSignOut, userId } = useAuth();
  const { projects, selectedProject, setSelectedProject, tasks, fetchTasksByProject } = useProject();

  const [modal, setModal] = useState({ type: null, data: null, initialStage: null });
  const [view, setView] = useState('list');

  // Initialize dbServices and Auth
  useEffect(() => {
    dbServices.initializeDbServices(db, auth, app.options.appId);
    setupAuth((uid) => {
      console.log("Logged in user:", uid);
    });
  }, []);

  // --- Modal Handlers ---
  const handleOpenForm = useCallback((type, data = null, initialStage = null) => {
    setModal({ type, data, initialStage });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModal({ type: null, data: null, initialStage: null });
    if (selectedProject) fetchTasksByProject(selectedProject.id);
  }, [selectedProject, fetchTasksByProject]);

  // --- Project Handlers ---
  const handleSelectProject = useCallback((project) => {
    setSelectedProject(project);
    setView('board');
    fetchTasksByProject(project.id);
  }, [setSelectedProject, fetchTasksByProject]);

  const handleDeleteProject = useCallback(async (projectId) => {
    if (window.confirm("Delete this project and all tasks?")) {
      try {
        await dbServices.deleteProject(projectId);
        if (selectedProject?.id === projectId) {
          setSelectedProject(null);
          setView('list');
        }
      } catch (err) {
        console.error(err);
      }
    }
  }, [selectedProject, setSelectedProject]);

  // --- Render Logic ---
  const currentProject = useMemo(() => projects.find(p => p.id === selectedProject?.id) || null, [projects, selectedProject]);

  const renderContent = () => {
    if (view === 'list' || !currentProject) {
      return <ProjectList onSelect={handleSelectProject} onEdit={(p) => handleOpenForm('project', p)} onDelete={handleDeleteProject} />;
    }
    return <KanbanBoard project={currentProject} tasks={tasks} onAddTask={(stage) => handleOpenForm('task', null, stage)} onEditTask={(task) => handleOpenForm('task', task)} />;
  };

  const renderModalContent = () => {
    switch (modal.type) {
      case 'project':
        return <ProjectForm projectToEdit={modal.data} onSave={handleCloseModal} onCancel={handleCloseModal} dbService={dbServices} />;
      case 'task':
        return <TaskForm project={currentProject} taskToEdit={modal.data} initialStage={modal.initialStage} onSave={handleCloseModal} dbServices={dbServices} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header projectName={currentProject?.name} view={view} setView={setView} onOpenForm={handleOpenForm} onSignOut={onSignOut} />
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">{renderContent()}</main>
      <Modal isOpen={!!modal.type} onClose={handleCloseModal} title={modal.type === 'project' ? (modal.data ? 'Edit Project' : 'Create Project') : (modal.data ? 'Edit Task' : 'Create Task')}>
        {renderModalContent()}
      </Modal>
    </div>
  );
};

// --- App Wrapper ---
const App = () => (
  <AuthProvider>
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  </AuthProvider>
);

export default App;
