import { 
  getFirestore, collection, query, onSnapshot, 
  addDoc, doc, updateDoc, deleteDoc, where 
} from 'firebase/firestore';

// We must initialize these using the function below after Firebase is ready
let db, auth, appId;

/**
 * Initializes the Firebase service module with necessary globals.
 * This function should be called once the Firebase app is initialized and auth state is ready 
 * (typically within AuthContext).
 * @param {object} firebaseDb - The initialized Firestore instance.
 * @param {object} firebaseAuth - The initialized Firebase Auth instance.
 * @param {string} currentAppId - The global app ID.
 */
export const initializeDbServices = (firebaseDb, firebaseAuth, currentAppId) => {
    db = firebaseDb;
    auth = firebaseAuth;
    appId = currentAppId;
    console.log("Database Services Initialized and Linked.");
};

// --- Helper Functions to get correct paths ---

const getUserId = () => auth.currentUser?.uid || 'anonymous';

// Gets the reference to a user-specific collection
const getCollectionRef = (collectionName) => {
    const userId = getUserId();
    // Path: /artifacts/{appId}/users/{userId}/{collectionName}
    return collection(db, `artifacts/${appId}/users/${userId}/${collectionName}`);
};

// --- Project CRUD Operations ---

/**
 * Creates a new project document in Firestore.
 * @param {object} data - Project data (name, color, stages, etc.).
 * @returns {Promise<string>} The ID of the newly created document.
 */
export const createProject = async (data) => {
    try {
        const docRef = await addDoc(getCollectionRef('projects'), data);
        return docRef.id;
    } catch (e) {
        console.error("Error creating project:", e);
        throw new Error("Failed to create project.");
    }
};

/**
 * Updates an existing project document.
 * @param {string} projectId - The ID of the project to update.
 * @param {object} data - The fields to update.
 */
export const updateProject = async (projectId, data) => {
    try {
        const projectDocRef = doc(getCollectionRef('projects'), projectId);
        await updateDoc(projectDocRef, data);
    } catch (e) {
        console.error("Error updating project:", e);
        throw new Error("Failed to update project.");
    }
};

/**
 * Deletes a project document. Note: This does NOT automatically delete associated tasks.
 * Task deletion should be handled separately or via more advanced security rules/cloud functions.
 * @param {string} projectId - The ID of the project to delete.
 */
export const deleteProject = async (projectId) => {
    try {
        // Find and delete all associated tasks first (manual cleanup)
        const tasksQuery = query(getCollectionRef('tasks'), where('projectId', '==', projectId));
        const taskDocs = await getDocs(tasksQuery);

        // Perform individual deletions (in a real app, use a batch write)
        for (const taskDoc of taskDocs.docs) {
             await deleteDoc(doc(getCollectionRef('tasks'), taskDoc.id));
        }
        
        // Delete the project document
        const projectDocRef = doc(getCollectionRef('projects'), projectId);
        await deleteDoc(projectDocRef);

    } catch (e) {
        console.error("Error deleting project and its tasks:", e);
        throw new Error("Failed to delete project.");
    }
};

/**
 * Sets up a real-time listener for all user projects.
 * @param {function} callback - Function to run with the array of projects on every data change.
 * @returns {function} The unsubscribe function to stop listening.
 */
export const streamProjects = (callback) => {
    const projectsRef = getCollectionRef('projects');
    const q = query(projectsRef); 
    
    return onSnapshot(q, (snapshot) => {
        const projects = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // Sort projects by createdAt descending (newest first)
        projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        callback(projects);
    }, (error) => {
        console.error("Error streaming projects:", error);
    });
};


// --- Task CRUD Operations ---

/**
 * Creates a new task document associated with a project.
 * @param {object} data - Task data ({ projectId, title, stage, color, description, order, ... }).
 * @returns {Promise<string>} The ID of the newly created document.
 */
export const createTask = async (data) => {
    try {
        const docRef = await addDoc(getCollectionRef('tasks'), data);
        return docRef.id;
    } catch (e) {
        console.error("Error creating task:", e);
        throw new Error("Failed to create task.");
    }
};

/**
 * Updates an existing task document.
 * @param {string} taskId - The ID of the task to update.
 * @param {object} data - The fields to update.
 */
export const updateTask = async (taskId, data) => {
    try {
        const taskDocRef = doc(getCollectionRef('tasks'), taskId);
        await updateDoc(taskDocRef, data);
    } catch (e) {
        console.error("Error updating task:", e);
        throw new Error("Failed to update task.");
    }
};

/**
 * Specifically updates a task's stage (used in Kanban drag-and-drop).
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newStage - The new stage/column name.
 */
export const updateTaskStage = async (taskId, newStage) => {
    await updateTask(taskId, { 
        stage: newStage,
        updatedAt: new Date().toISOString()
    });
};

/**
 * Deletes a task document.
 * @param {string} taskId - The ID of the task to delete.
 */
export const deleteTask = async (taskId) => {
    try {
        const taskDocRef = doc(getCollectionRef('tasks'), taskId);
        await deleteDoc(taskDocRef);
    } catch (e) {
        console.error("Error deleting task:", e);
        throw new Error("Failed to delete task.");
    }
};

/**
 * Sets up a real-time listener for tasks belonging to a specific project.
 * @param {string} projectId - The ID of the project whose tasks to stream.
 * @param {function} callback - Function to run with the array of tasks on every data change.
 * @returns {function} The unsubscribe function to stop listening.
 */
export const streamTasks = (projectId, callback) => {
    const tasksRef = getCollectionRef('tasks');
    // Query: Where 'projectId' field equals the selected projectId
    const q = query(tasksRef, where('projectId', '==', projectId));

    return onSnapshot(q, (snapshot) => {
        const tasks = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        // Sort by 'order' or by creation time in memory
        tasks.sort((a, b) => {
            // Priority sort: use numeric 'order' first, then fallback to creation time
            if (a.order !== undefined && b.order !== undefined) {
                return a.order - b.order;
            }
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
        callback(tasks);
    }, (error) => {
        console.error("Error streaming tasks:", error);
    });
};