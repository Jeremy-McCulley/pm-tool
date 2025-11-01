import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // Import the Auth Context
import * as dbServices from '../firebase/dbServices'; // Import the CRUD functions

// --- Context Setup ---
const ProjectContext = createContext(null);

/**
 * Custom hook to consume the project and task state.
 * @returns {{
 * projects: Array<object>,
 * tasks: Array<object>,
 * selectedProject: object | null,
 * selectProject: function,
 * clearSelectedProject: function,
 * projectListLoading: boolean,
 * taskListLoading: boolean,
 * dbServices: object // Expose db services for CRUD actions in forms
 * }}
 */
export const useProject = () => {
  return useContext(ProjectContext);
};


/**
 * Provides real-time project and task data fetched from Firestore.
 */
export const ProjectProvider = ({ children }) => {
  const { userId, isLoading: isAuthLoading } = useAuth(); // Get auth state
  
  // State for all projects
  const [projects, setProjects] = useState([]);
  const [projectListLoading, setProjectListLoading] = useState(true);
  
  // State for the currently selected project (for Kanban view)
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  
  // State for tasks belonging to the selected project
  const [tasks, setTasks] = useState([]);
  const [taskListLoading, setTaskListLoading] = useState(false);

  // Get the current project object from the list
  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;


  // --- Project Streaming Effect ---
  useEffect(() => {
    // Only proceed if auth is ready and user is logged in
    if (!userId || isAuthLoading) {
        if (!isAuthLoading) setProjectListLoading(false);
        return;
    }

    setProjectListLoading(true);
    let unsubscribe;

    try {
        // Start listening to the stream of all user projects
        unsubscribe = dbServices.streamProjects(newProjects => {
            setProjects(newProjects);
            setProjectListLoading(false);
        });
    } catch (e) {
        console.error("Failed to set up project stream:", e);
        setProjectListLoading(false);
    }
    
    // Cleanup the listener when the component unmounts or dependencies change
    return () => {
        if (unsubscribe) unsubscribe();
    };
  }, [userId, isAuthLoading]);


  // --- Task Streaming Effect (runs when selectedProject changes) ---
  useEffect(() => {
    let unsubscribe;
    
    // Only proceed if a project is selected
    if (!selectedProjectId || !userId) {
        setTasks([]);
        setTaskListLoading(false);
        return;
    }

    setTaskListLoading(true);
    
    try {
        // Start listening to the stream of tasks for the selected project
        unsubscribe = dbServices.streamTasks(selectedProjectId, newTasks => {
            setTasks(newTasks);
            setTaskListLoading(false);
        });
    } catch (e) {
        console.error("Failed to set up task stream:", e);
        setTaskListLoading(false);
    }

    return () => {
        if (unsubscribe) unsubscribe();
    };
  }, [selectedProjectId, userId]);


  // --- Selectors and Mutators ---
  
  const selectProject = useCallback((projectId) => {
    setSelectedProjectId(projectId);
  }, []);
  
  const clearSelectedProject = useCallback(() => {
    setSelectedProjectId(null);
  }, []);


  // --- Context Value ---
  const value = {
    projects,
    tasks,
    selectedProject,
    selectProject,
    clearSelectedProject,
    projectListLoading,
    taskListLoading,
    // Expose dbServices for components that need to perform CRUD actions (like forms)
    dbServices 
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};