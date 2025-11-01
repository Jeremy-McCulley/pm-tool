import React, { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import * as dbServices from '../firebase/dbServices'; // We will create this next

// --- Global Variables (Mandatory Canvas Globals) ---
// These variables are injected into the environment and MUST be used.
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Create the Context
const AuthContext = createContext(null);

/**
 * Custom hook to use the authentication and Firebase context throughout the app.
 * @returns {{
 * userId: string | null, 
 * isAuthenticated: boolean, 
 * isLoading: boolean, 
 * db: object | null, 
 * auth: object | null
 * }}
 */
export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * Provides Firebase initialization, authentication state, and core service instances.
 */
export const AuthProvider = ({ children }) => {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!firebaseConfig) {
      console.error("Firebase configuration is missing.");
      setIsLoading(false);
      return;
    }

    // 1. Initialize Firebase App and Services
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const firebaseAuth = getAuth(app);
      setLogLevel('debug'); // Enable Firestore logging for debugging

      setDb(firestore);
      setAuth(firebaseAuth);

      // 2. Set Auth Persistence and Listen for State Changes
      setPersistence(firebaseAuth, browserSessionPersistence).then(() => {
        // Auth state listener: Runs on initialization and whenever auth state changes
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
          if (user) {
            // User is signed in
            setUserId(user.uid);
            console.log("Firebase Auth State: Signed In", user.uid);
          } else {
            // User is signed out (or initial anonymous sign-in attempt failed)
            setUserId(null);
            console.log("Firebase Auth State: Signed Out.");
          }

          setIsLoading(false);
          
          // 3. Initialize Database Services (must be done after db/auth are available)
          if (firestore && firebaseAuth) {
             // Pass the initialized instances and app ID to the dbServices module
             dbServices.initializeDbServices(firestore, firebaseAuth, appId);
          }
        });
        
        // 4. Perform Initial Sign-in
        const performSignIn = async () => {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(firebaseAuth, initialAuthToken);
                    console.log("Signed in with custom token.");
                } else {
                    // Fallback to anonymous sign-in if token is missing (though should be present)
                    await signInAnonymously(firebaseAuth);
                    console.log("Signed in anonymously.");
                }
            } catch (error) {
                console.error("Authentication failed during initial sign-in:", error);
                // Even on failure, the onAuthStateChanged listener above will handle setting userId=null
            }
        };

        // If the user isn't already authenticated (listener will detect this), sign them in
        if (!firebaseAuth.currentUser) {
            performSignIn();
        }

        return () => unsubscribe(); // Cleanup the listener
      });
      
    } catch (error) {
      console.error("Firebase Initialization Error:", error);
      setIsLoading(false);
    }
  }, []); // Run only once on mount

  const value = {
    userId,
    isAuthenticated: !!userId,
    isLoading,
    db,
    auth
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Show a loading state until authentication resolves */}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen bg-gray-50">
          <p className="text-lg text-indigo-600 animate-pulse">
            Connecting to Project Manager Database...
          </p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};