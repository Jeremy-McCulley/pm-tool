import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, app, setupAuth } from '../firebase/firebaseConfig';
import dbServices from '../firebase/dbServices';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize dbServices with Firebase objects
    dbServices.initializeDbServices(null, auth, app.options.appId);

    // Setup Firebase auth listener
    setupAuth((uid) => {
      setUserId(uid);
      setIsLoading(false);
      console.log("Logged in userId:", uid);
    });
  }, []);

  const onSignOut = async () => {
    try {
      await auth.signOut();
      setUserId(null);
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  const value = {
    userId,
    isAuthenticated: !!userId,
    isLoading,
    auth,
    onSignOut
  };

  return (
    <AuthContext.Provider value={value}>
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
