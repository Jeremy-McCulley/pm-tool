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
import './styles/global.less';
// --- Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modalContainer">
      <div className="" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <h3 className="modalHeaderTitle">{title}</h3>
          <button onClick={onClose} className="" aria-label="Close modal">
            <X className="" />
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
};

// --- Header Component ---
const Header = ({ projectName, view, setView, onOpenForm, onSignOut }) => {
  const { userId } = useAuth();

  return (
    <header className="mainHeading">
      <div className="headingContainer">
        <div className="logoContainer">
          <img src='black-orange-white-logo-transparent.png' alt='Jeremy McCulley'/>
          <h1 className=""><ListChecks className="" />Task Flow</h1>
          {projectName && (<span className="">{projectName}</span>)}
        </div>

        <nav className="btnContainer">
          {projectName && (
            <>
              <button onClick={() => setView('board')}>
                <LayoutDashboard className="" />
                Board
              </button>
              <button onClick={() => setView('list')}>
                <Home className="" />
                Projects
              </button>
            </>
          )}

          {!projectName && view === 'list' && (
            <button onClick={() => onOpenForm('project')} className="newProject">
              New Project
            </button>
          )}
          {projectName && view === 'board' && (
            <button onClick={() => onOpenForm('task')} className="newTask">
              New Task
            </button>
          )}

          <button onClick={onSignOut} className="signOut" title="Sign Out">
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
    <div className="manAppContainer">
      <Header projectName={currentProject?.name} view={view} setView={setView} onOpenForm={handleOpenForm} onSignOut={onSignOut} />
      <section className='welcomeMsg'>
        {userId && (<span className="" title="Your User ID">Welcome User: {userId}</span>)}
      </section>
      <main className="">{renderContent()}
        <section className='masthead'>
          <h2>Welcome to Task Flow</h2>
        </section>
      </main>
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
