import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const setupAuth = (callback) => {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      try {
        if (import.meta.env.VITE_FIREBASE_CUSTOM_TOKEN) {
          await signInWithCustomToken(auth, import.meta.env.VITE_FIREBASE_CUSTOM_TOKEN);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Authentication failed, proceeding anonymously:", error);
      }
    }
    const userId = auth.currentUser?.uid || crypto.randomUUID();
    callback(userId);
  });
};

export { db, auth, app, setupAuth };
