const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// 1. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 2. Authentication Setup (for use in AuthContext)
export const setupAuth = (callback) => {
    // This listener handles sign-in with the token or anonymously
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Authentication failed, proceeding anonymously:", error);
            }
        }
        // After sign-in attempt, get the definitive userId
        const userId = auth.currentUser?.uid || crypto.randomUUID();
        callback(userId);
    });
};

export { db, auth, appId };
