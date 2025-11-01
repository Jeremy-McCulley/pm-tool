import { 
  getFirestore, collection, query, onSnapshot, 
  addDoc, doc, updateDoc, deleteDoc, where, getDocs 
} from 'firebase/firestore';

// We must initialize these using the function below after Firebase is ready
let db, auth, appId;

/**
 * Initializes the Firebase service module with necessary globals.
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

// --- Helper Functions ---
const getUserId = () => auth.currentUser?.uid || 'anonymous';

const getCollectionRef = (collectionName) => {
  const userId = getUserId();
  return collection(db, `artifacts/${appId}/users/${userId}/${collectionName}`);
};

// --- Project CRUD ---
export const createProject = async (data) => {
  try {
    const docRef = await addDoc(getCollectionRef('projects'), data);
    return docRef.id;
  } catch (e) {
    console.error("Error creating project:", e);
    throw new Error("Failed to create project.");
  }
};

export const updateProject = async (projectId, data) => {
  try {
    const projectDocRef = doc(getCollectionRef('projects'), projectId);
    await updateDoc(projectDocRef, data);
  } catch (e) {
    console.error("Error updating project:", e);
    throw new Error("Failed to update project.");
  }
};

export const deleteProject = async (projectId) => {
  try {
    const tasksQuery = query(getCollectionRef('tasks'), where('projectId', '==', projectId));
    const taskDocs = await getDocs(tasksQuery);

    for (const taskDoc of taskDocs.docs) {
      await deleteDoc(doc(getCollectionRef('tasks'), taskDoc.id));
    }

    const projectDocRef = doc(getCollectionRef('projects'), projectId);
    await deleteDoc(projectDocRef);

  } catch (e) {
    console.error("Error deleting project and its tasks:", e);
    throw new Error("Failed to delete project.");
  }
};

export const streamProjects = (callback) => {
  const projectsRef = getCollectionRef('projects');
  const q = query(projectsRef);

  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    callback(projects);
  }, (error) => {
    console.error("Error streaming projects:", error);
  });
};

// --- Task CRUD ---
export const createTask = async (data) => {
  try {
    const docRef = await addDoc(getCollectionRef('tasks'), data);
    return docRef.id;
  } catch (e) {
    console.error("Error creating task:", e);
    throw new Error("Failed to create task.");
  }
};

export const updateTask = async (taskId, data) => {
  try {
    const taskDocRef = doc(getCollectionRef('tasks'), taskId);
    await updateDoc(taskDocRef, data);
  } catch (e) {
    console.error("Error updating task:", e);
    throw new Error("Failed to update task.");
  }
};

export const updateTaskStage = async (taskId, newStage) => {
  await updateTask(taskId, { 
    stage: newStage,
    updatedAt: new Date().toISOString()
  });
};

export const deleteTask = async (taskId) => {
  try {
    const taskDocRef = doc(getCollectionRef('tasks'), taskId);
    await deleteDoc(taskDocRef);
  } catch (e) {
    console.error("Error deleting task:", e);
    throw new Error("Failed to delete task.");
  }
};

export const streamTasks = (projectId, callback) => {
  const tasksRef = getCollectionRef('tasks');
  const q = query(tasksRef, where('projectId', '==', projectId));

  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    tasks.sort((a, b) => {
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

// --- Default export object ---
const dbServices = {
  initializeDbServices,
  createProject,
  updateProject,
  deleteProject,
  streamProjects,
  createTask,
  updateTask,
  updateTaskStage,
  deleteTask,
  streamTasks
};

export default dbServices;
